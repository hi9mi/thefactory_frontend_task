import type { HttpError } from '@tf-app/shared/api'
import type QuickLRU from 'quick-lru'
import type { GalleryGateway, GalleryItem, GallerySearchResult } from './gateway'
import { isHttpError } from '@tf-app/shared/api'
import { token } from 'ditox'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

const normalizeQuery = (q: string) => q.trim().toLowerCase().replaceAll(/\s+/g, ' ')

const galleryKey = (count: number) => `gallery:count=${count}`
const searchKey = (q: string, p: number) => `search:q=${normalizeQuery(q)}::page=${p}`

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Invalid access token',
  403: 'Forbidden (check permissions/rate limit)',
  404: 'Not Found',
  500: 'Server error, try later',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
}

function normalizeHttpError(e: HttpError) {
  if (e.rateLimit?.remaining === 0) {
    return 'Rate limit exceeded'
  }
  return e.errors?.join(', ') ?? ERROR_MESSAGES[e.status] ?? (e.status >= 500 ? 'Server error, try later' : 'Unknown HTTP error')
}

type GalleryRandomStore = ReturnType<ReturnType<typeof createGalleryRandomStore>>

export const GALLERY_RANDOM_STORE_TOKEN = token<GalleryRandomStore>('GalleryRandomStore')
// TODO: refactor
export function createGalleryRandomStore(key: string, deps: {
  gateway: GalleryGateway
  cache: QuickLRU<string, GalleryItem[]>
}) {
  return defineStore(key, () => {
    const { gateway, cache } = deps

    const galleryState = reactive<{
      items: GalleryItem[]
      loading: boolean
      error: string | null
    }>({
      items: [],
      loading: false,
      error: null,
    })

    const inflightRequests = new Map<string, Promise<GalleryItem[]>>()

    async function fetchPhotos(count = 18, init?: RequestInit) {
      const cacheKey = galleryKey(count)
      const hit = cache.get(cacheKey)

      if (hit) {
        galleryState.items = hit
        galleryState.loading = false
        galleryState.error = null
        return
      }

      if (inflightRequests.has(cacheKey)) {
        await inflightRequests.get(cacheKey)
        return
      }

      galleryState.loading = true
      galleryState.error = null

      const request = gateway.random(count, init)
      inflightRequests.set(cacheKey, request)

      try {
        const items = await request
        galleryState.items = items
        galleryState.error = null
        cache.set(cacheKey, items)
      }
      catch (error) {
        if (isHttpError(error)) {
          galleryState.error = normalizeHttpError(error)
        }
      }
      finally {
        inflightRequests.delete(cacheKey)
        galleryState.loading = false
      }
    }

    const items = computed(() => galleryState.items)
    const loading = computed(() => galleryState.loading)
    const error = computed(() => galleryState.error)

    return {
      fetchPhotos,
      items,
      loading,
      error,
    }
  })
}

type GallerySearchStore = ReturnType<ReturnType<typeof createGalleryStore>>

export const GALLERY_SEARCH_STORE_TOKEN = token<GallerySearchStore>('GallerySearchStore')

export function createGalleryStore(key: string, deps: {
  gateway: GalleryGateway
  cache: QuickLRU<string, GallerySearchResult>
}) {
  return defineStore(key, () => {
    const { gateway, cache } = deps

    const galleryState = reactive<{
      items: GalleryItem[]
      totalPages: number
      total: number
      loading: boolean
      error: string | null
    }>({
      items: [],
      totalPages: 0,
      total: 0,
      loading: false,
      error: null,
    })

    const inflightRequests = new Map<string, Promise<GallerySearchResult>>()

    async function search(
      { query, page, perPage }: { query: string, page: number, perPage: number },
      init?: RequestInit,
    ) {
      const q = (query ?? '').trim()
      if (!q.length) {
        galleryState.items = []
        galleryState.error = null
        galleryState.loading = false
        galleryState.total = 0
        galleryState.totalPages = 0
        return
      }

      const cacheKey = searchKey(q, page)

      const hit = cache.get(cacheKey)
      if (hit) {
        galleryState.items = hit.items
        galleryState.loading = false
        galleryState.total = hit.total
        galleryState.totalPages = hit.totalPages
        galleryState.error = null
        return
      }

      if (inflightRequests.has(cacheKey)) {
        await inflightRequests.get(cacheKey)
        return
      }

      galleryState.loading = true
      galleryState.error = null

      const request = gateway.search({ query, page, perPage }, init)
      inflightRequests.set(cacheKey, request)

      try {
        const data = await request
        cache.set(cacheKey, data)
        galleryState.items = data.items
        galleryState.total = data.total
        galleryState.totalPages = data.totalPages
      }
      catch (error) {
        if (isHttpError(error)) {
          galleryState.error = normalizeHttpError(error)
        }
      }
      finally {
        inflightRequests.delete(cacheKey)
        galleryState.loading = false
      }
    }

    const items = computed(() => galleryState.items)
    const loading = computed(() => galleryState.loading)
    const error = computed(() => galleryState.error)
    const totalPages = computed(() => galleryState.totalPages)
    const total = computed(() => galleryState.total)

    return {
      items,
      loading,
      error,
      totalPages,
      total,
      search,
    }
  })
}
