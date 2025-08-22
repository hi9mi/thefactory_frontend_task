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
  const inflight = new Map<string, Promise<unknown>>()

  const ensureEntry = (id: string): Entry =>
    (byId[id] ??= reactive<Entry>({ item: null, loading: false, error: null }))

  async function ensure(id: string, init?: RequestInit) {
    const e = ensureEntry(id)

    const hit = cache.get(id)
    if (hit) {
      e.item = hit
      e.loading = false
      e.error = null
      return hit
    }

    if (inflight.has(id)) {
      await inflight.get(id)
      return e.item
    }

    e.loading = true
    e.error = null

    const promise = (async () => {
      try {
        const item = await gateway.getById(id, init)
        cache.set(id, item)
        e.item = item
      }
      catch (err: any) {
        if (isAbortError(err))
          return
        if (isHttpError(err)) {
          if (err.errors?.length)
            e.error = err.errors.join(', ')
          else if (err.status === 401)
            e.error = 'Invalid access token'
          else if (err.status === 403)
            e.error = 'Forbidden (check permissions/rate limit)'
          else if (err.status === 404)
            e.error = 'Not found'
          else if (err.status === 400)
            e.error = 'Bad request'
          else if (err.status >= 500)
            e.error = 'Server error, try later'
          if (err.rateLimit?.remaining === 0)
            e.error = 'Rate limit exceeded, please try again later'
        }
        else {
          e.error = err?.message ?? 'Unknown error'
        }
      }
      finally {
        e.loading = false
      }
    })().finally(() => inflight.delete(id))

    inflight.set(id, promise)
    await promise
    return e.item
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

  function clear() {
    for (const k of Object.keys(byId)) delete byId[k]
    inflight.clear()
    cache.clear()
  }

  return { ensure, reload, getState, clear }
}
