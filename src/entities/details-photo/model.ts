import type { DetailsPhoto, PhotoDetailsGateway } from './gateway'
import { isAbortError, isHttpError } from '@tf-app/shared/api'
import { token } from '@tf-app/shared/di/container'
import { reactive } from 'vue'

interface Entry { item: DetailsPhoto | null, loading: boolean, error: string | null }

export interface PhotoDetailsCache {
  byId: Record<string, Entry>
  inflight: Map<string, Promise<any>>
  clear: () => void
}

export const PHOTO_DETAILS_CACHE = token<PhotoDetailsCache>('PhotoDetailsCache')

export function createPhotoDetailsCache(): PhotoDetailsCache {
  const byId = reactive<Record<string, Entry>>({})
  const inflight = new Map<string, Promise<any>>()
  function clear() {
    for (const k of Object.keys(byId)) delete byId[k]
    inflight.clear()
  }
  return { byId, inflight, clear }
}

function ensureEntry(cache: PhotoDetailsCache, id: string): Entry {
  return (cache.byId[id] ??= reactive<Entry>({ item: null, loading: false, error: null }))
}

export function createPhotoDetailsEntity(deps: { gateway: PhotoDetailsGateway, cache: PhotoDetailsCache }) {
  const { gateway, cache } = deps

  async function ensure(id: string, init?: RequestInit) {
    const entry = ensureEntry(cache, id)
    if (entry.item)
      return entry.item
    if (cache.inflight.has(id)) {
      await cache.inflight.get(id)
      return entry.item
    }

    entry.loading = true
    entry.error = null
    const promise = (async () => {
      try {
        entry.item = await gateway.getById(id, init)
      }
      catch (e) {
        if (isAbortError(e))
          return
        if (isHttpError(e)) {
          if (e.status === 401)
            entry.error = 'Invalid access token'
          else if (e.status === 403)
            entry.error = 'Forbidden (check permissions/rate limit)'
          else if (e.status === 404)
            entry.error = 'Not found'
          else if (e.status === 400)
            entry.error = 'Bad request'
          else if (e.status >= 500)
            entry.error = 'Server error, try later'
          if (e.errors?.length)
            entry.error = e.errors.join(', ')
          if (e.rateLimit?.remaining === 0) {
            entry.error = 'Rate limit exceeded, please try again later'
          }
        }
        else {
          entry.error = (e as any)?.message ?? 'Unknown Error'
        }
      }
      finally {
        entry.loading = false
      }
    })().finally(() => cache.inflight.delete(id))

    cache.inflight.set(id, promise)
    await promise
    return entry.item
  }

  async function reload(id: string, init?: RequestInit) {
    const e = ensureEntry(cache, id)
    e.item = null
    return ensure(id, init)
  }

  function getState(id: string): Entry {
    return ensureEntry(cache, id)
  }

  return { ensure, reload, getState, clear: cache.clear }
}
