import type { LRUCacheManager } from '@tf-app/shared/libs/cache/manager'
import type { DetailsPhoto, PhotoDetailsGateway } from './gateway'
import { isAbortError, isHttpError } from '@tf-app/shared/api'
import { reactive } from 'vue'

interface Entry { item: DetailsPhoto | null, loading: boolean, error: string | null }

export function createPhotoDetailsEntity(deps: { gateway: PhotoDetailsGateway, lru: LRUCacheManager }) {
  const { gateway, lru } = deps

  const cache = lru.scope<string, DetailsPhoto>('details', {
    max: 100,
    ttl: 30 * 60_000,
    serializeKey: id => id,
  })

  const byId: Record<string, Entry> = reactive({})
  const inflight = new Map<string, Promise<unknown>>() // общие in-flight для ensure/prefetch

  const prefetchTimers = new Map<string, number>()
  const prefetchCtrls = new Map<string, AbortController>()

  const ensureEntry = (id: string): Entry =>
    (byId[id] ??= reactive<Entry>({ item: null, loading: false, error: null }))

  async function fetchAndCache(id: string, init?: RequestInit) {
    const item = await gateway.getById(id, init)
    cache.set(id, item)
    return item
  }

  function setInflight(id: string, promise: Promise<unknown>) {
    inflight.set(id, promise.finally(() => inflight.delete(id)))
  }

  async function ensure(id: string, init?: RequestInit) {
    const entry = ensureEntry(id)

    const hit = cache.get(id)
    if (hit) {
      entry.item = hit
      entry.loading = false
      entry.error = null
      return hit
    }

    if (inflight.has(id)) {
      await inflight.get(id)
      const hit2 = cache.get(id)
      if (hit2) {
        entry.item = hit2
        entry.loading = false
        entry.error = null
      }
      return entry.item
    }

    entry.loading = true
    entry.error = null

    const promise = (async () => {
      try {
        const item = await fetchAndCache(id, init)
        entry.item = item
      }
      catch (err: any) {
        if (isAbortError(err))
          return
        if (isHttpError(err)) {
          if (err.errors?.length)
            entry.error = err.errors.join(', ')
          else if (err.status === 401)
            entry.error = 'Invalid access token'
          else if (err.status === 403)
            entry.error = 'Forbidden (check permissions/rate limit)'
          else if (err.status === 404)
            entry.error = 'Not found'
          else if (err.status === 400)
            entry.error = 'Bad request'
          else if (err.status >= 500)
            entry.error = 'Server error, try later'
          if (err.rateLimit?.remaining === 0)
            entry.error = 'Rate limit exceeded, please try again later'
        }
        else {
          entry.error = err?.message ?? 'Unknown error'
        }
      }
      finally {
        entry.loading = false
      }
    })()

    setInflight(id, promise)
    await promise
    return entry.item
  }

  async function reload(id: string, init?: RequestInit) {
    cache.delete(id)
    const e = ensureEntry(id)
    e.item = null
    return ensure(id, init)
  }

  function getState(id: string): Entry {
    return ensureEntry(id)
  }

  function isCached(id: string) {
    return cache.has(id)
  }

  function cancelPrefetch(id: string) {
    const t = prefetchTimers.get(id)
    if (t != null) {
      clearTimeout(t)
      prefetchTimers.delete(id)
    }
    const c = prefetchCtrls.get(id)
    if (c) {
      c.abort()
      prefetchCtrls.delete(id)
    }
  }

  function cancelAllPrefetch() {
    for (const id of prefetchTimers.keys()) cancelPrefetch(id)
    for (const id of prefetchCtrls.keys()) cancelPrefetch(id)
  }

  function prefetch(id: string, opts?: { delayMs?: number, signal?: AbortSignal }) {
    if (isCached(id) || inflight.has(id))
      return

    const delay = opts?.delayMs ?? 150
    const timer = window.setTimeout(() => {
      if (isCached(id) || inflight.has(id)) {
        prefetchTimers.delete(id)
        return
      }

      const ctrl = new AbortController()
      prefetchCtrls.set(id, ctrl)

      const signal = opts?.signal
      const onAbort = () => ctrl.abort()
      signal?.addEventListener('abort', onAbort, { once: true })

      const promise = (async () => {
        try {
          await fetchAndCache(id, { signal: ctrl.signal })
        }
        catch {
        }
        finally {
          signal?.removeEventListener('abort', onAbort)
          prefetchCtrls.delete(id)
        }
      })()

      setInflight(id, promise)
      prefetchTimers.delete(id)
    }, delay)

    prefetchTimers.set(id, timer)
  }

  function clear() {
    for (const k of Object.keys(byId)) delete byId[k]
    inflight.clear()
    cancelAllPrefetch()
    cache.clear()
  }

  return {
    ensure,
    reload,
    getState,
    clear,
    prefetch,
    cancelPrefetch,
    cancelAllPrefetch,
    isCached,
  }
}
