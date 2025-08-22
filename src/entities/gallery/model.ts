import type { LRUCacheManager } from '@tf-app/shared/libs/cache/manager'
import type { GalleryGateway, GalleryItem } from './gateway'
import { isAbortError, isHttpError } from '@tf-app/shared/api'
import { computed, reactive, ref } from 'vue'

interface SearchEntry { items: GalleryItem[], loading: boolean, error: string | null }

const keyOf = (q: string, p: number) => `${q.trim()}::${p}`

export function createGalleryEntity(deps: { gateway: GalleryGateway, lru: LRUCacheManager }) {
  const { gateway, lru } = deps

  const listCache = lru.scope<string, GalleryItem[]>('gallery:list', {
    max: 100,
    ttl: 10 * 60_000,
    serializeKey: k => k,
  })
  const totalsCache = lru.scope<string, number>('gallery:total', {
    max: 200,
    ttl: 10 * 60_000,
    serializeKey: q => q.trim(),
  })
  const randomCache = lru.scope<string, GalleryItem[]>('gallery:random', {
    max: 5,
    ttl: 10 * 60_000,
    serializeKey: k => k,
  })

  const random = ref<GalleryItem[]>([])
  const randomLoading = ref(false)
  const randomError = ref<string | null>(null)

  const entries: Record<string, SearchEntry> = reactive({})
  const inflight = new Map<string, Promise<unknown>>()

  const ensureEntry = (q: string, p: number): SearchEntry =>
    (entries[keyOf(q, p)] ??= reactive<SearchEntry>({ items: [], loading: false, error: null }))

  async function ensureRandom(count = 9, init?: RequestInit) {
    const cacheKey = String(count)
    const hit = randomCache.get(cacheKey)
    if (hit && hit.length >= count) {
      random.value = hit
      return hit
    }

    const inflightKey = `random:${count}`
    if (inflight.has(inflightKey)) {
      await inflight.get(inflightKey)
      return random.value
    }

    randomLoading.value = true
    randomError.value = null

    const promise = (async () => {
      try {
        const items = await gateway.random(count, init)
        randomCache.set(cacheKey, items)
        random.value = items
      }
      catch (e: any) {
        if (isAbortError(e))
          return
        if (isHttpError(e)) {
          if (e.errors?.length)
            randomError.value = e.errors.join(', ')
          else if (e.status === 401)
            randomError.value = 'Invalid access token'
          else if (e.status === 403)
            randomError.value = 'Forbidden (check permissions/rate limit)'
          else if (e.status === 404)
            randomError.value = 'Not found'
          else if (e.status === 400)
            randomError.value = 'Bad request'
          else if (e.status >= 500)
            randomError.value = 'Server error, try later'
          if (e.rateLimit?.remaining === 0)
            randomError.value = 'Rate limit exceeded, please try again later'
        }
        else {
          randomError.value = e?.message ?? 'Unknown error'
        }
      }
      finally {
        randomLoading.value = false
      }
    })().finally(() => inflight.delete(inflightKey))

    inflight.set(inflightKey, promise)
    await promise
    return random.value
  }

  async function reloadRandom(count = 9, init?: RequestInit) {
    randomCache.delete(String(count))
    random.value = []
    return ensureRandom(count, init)
  }

  async function search(query: string, page = 1, init?: RequestInit) {
    const q = (query ?? '').trim()
    if (!q)
      return []

    const cacheKey = keyOf(q, page)
    const entry = ensureEntry(q, page)

    const hit = listCache.get(cacheKey)
    if (hit) {
      entry.items = hit
      entry.loading = false
      entry.error = null
      return hit
    }

    if (inflight.has(cacheKey)) {
      await inflight.get(cacheKey)
      return entry.items
    }

    entry.loading = true
    entry.error = null

    const promise = (async () => {
      try {
        const { items, totalPages } = await gateway.search(q, page, init)
        listCache.set(cacheKey, items)
        totalsCache.set(q, totalPages)
        entry.items = items
      }
      catch (e: any) {
        if (isAbortError(e))
          return
        if (isHttpError(e)) {
          if (e.errors?.length)
            entry.error = e.errors.join(', ')
          else if (e.status === 401)
            entry.error = 'Invalid access token'
          else if (e.status === 403)
            entry.error = 'Forbidden (check permissions/rate limit)'
          else if (e.status === 404)
            entry.error = 'Not found'
          else if (e.status === 400)
            entry.error = 'Bad request'
          else if (e.status >= 500)
            entry.error = 'Server error, try later'
          if (e.rateLimit?.remaining === 0)
            entry.error = 'Rate limit exceeded, please try again later'
        }
        else {
          entry.error = e?.message ?? 'Unknown error'
        }
      }
      finally {
        entry.loading = false
      }
    })().finally(() => inflight.delete(cacheKey))

    inflight.set(cacheKey, promise)
    await promise
    return entry.items
  }

  function getSearchState(query: string, page: number) {
    return ensureEntry(query, page)
  }

  function getTotalPages(query: string) {
    return totalsCache.get(query.trim()) ?? 0
  }

  const randomLoaded = computed(() => random.value.length > 0 && !randomLoading.value)

  return {
    random,
    randomLoading,
    randomError,
    randomLoaded,
    ensureRandom,
    reloadRandom,
    search,
    getSearchState,
    getTotalPages,
  }
}
