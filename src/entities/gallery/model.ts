import type { Ref } from 'vue'
import type { GalleryGateway, GalleryItem } from './gateway'
import { token } from '@tf-app/shared/di/container'
import { computed, reactive, ref } from 'vue'

interface SearchEntry { items: GalleryItem[], loading: boolean, error: string | null }

export interface GalleryCache {
  random: Ref<GalleryItem[]>
  randomLoading: Ref<boolean>
  randomError: Ref<string | null>

  searchEntries: Record<string, SearchEntry>

  totalsByQuery: Record<string, number>

  inflight: Map<string, Promise<any>>
  clear: () => void
}

export const GALLERY_CACHE = token<GalleryCache>('GalleryCache')

export function createGalleryCache(): GalleryCache {
  const random = ref<GalleryItem[]>([])
  const randomLoading = ref(false)
  const randomError = ref<string | null>(null)

  const searchEntries = reactive<Record<string, { items: GalleryItem[], loading: boolean, error: string | null }>>({})
  const totalsByQuery = reactive<Record<string, number>>({})
  const inflight = new Map<string, Promise<any>>()

  function clear() {
    random.value = []
    randomLoading.value = false
    randomError.value = null
    for (const k of Object.keys(searchEntries)) delete searchEntries[k]
    for (const k of Object.keys(totalsByQuery)) delete totalsByQuery[k]
    inflight.clear()
  }

  return { random, randomLoading, randomError, searchEntries, totalsByQuery, inflight, clear }
}

function makeEntry() {
  return reactive<SearchEntry>({ items: [], loading: false, error: null })
}

function keyOf(q: string, p: number) {
  return `${q}::${p}`
}

export function createGalleryEntity(deps: { gateway: GalleryGateway, cache: GalleryCache }) {
  const { gateway, cache } = deps

  async function ensureRandom(count = 9, init?: RequestInit) {
    if (cache.random.value.length >= count)
      return cache.random.value

    const key = 'random'
    if (cache.inflight.has(key)) {
      await cache.inflight.get(key)
      return cache.random.value
    }

    cache.randomLoading.value = true
    cache.randomError.value = null

    const promise = (async () => {
      try {
        const items = await gateway.random(count, init)
        cache.random.value = items
      }
      catch (e: any) {
        if (e?.name !== 'AbortError')
          cache.randomError.value = e?.message ?? 'Failed to load random photos'
      }
      finally {
        cache.randomLoading.value = false
      }
    })().finally(() => cache.inflight.delete(key))

    cache.inflight.set(key, promise)
    await promise
    return cache.random.value
  }

  async function reloadRandom(count = 9, init?: RequestInit) {
    cache.random.value = []
    return ensureRandom(count, init)
  }

  function ensureEntry(q: string, p: number): SearchEntry {
    const key = keyOf(q, p)
    return (cache.searchEntries[key] ??= makeEntry())
  }

  async function search(query: string, page = 1, init?: RequestInit) {
    const q = (query ?? '').trim()
    if (!q)
      return []

    const key = keyOf(q, page)
    const entry = ensureEntry(q, page)

    if (entry.items.length)
      return entry.items
    if (cache.inflight.has(key)) {
      await cache.inflight.get(key)
      return entry.items
    }

    entry.loading = true
    entry.error = null

    const promise = (async () => {
      try {
        const { items, totalPages } = await gateway.search(q, page, init)
        entry.items = items
        cache.totalsByQuery[q] = totalPages
      }
      catch (e: any) {
        if (e?.name !== 'AbortError')
          entry.error = e?.message ?? 'Search failed'
      }
      finally {
        entry.loading = false
      }
    })().finally(() => cache.inflight.delete(key))

    cache.inflight.set(key, promise)
    await promise
    return entry.items
  }

  function getSearchState(query: string, page: number) {
    return ensureEntry(query, page)
  }

  function getTotalPages(query: string) {
    return cache.totalsByQuery[query.trim()] ?? 0
  }

  const randomLoaded = computed(() => cache.random.value.length > 0 && !cache.randomLoading.value)

  return {
    random: cache.random,
    randomLoading: cache.randomLoading,
    randomError: cache.randomError,
    randomLoaded,

    ensureRandom,
    reloadRandom,

    search,
    getSearchState,
    getTotalPages,

    clear: cache.clear,
  }
}
