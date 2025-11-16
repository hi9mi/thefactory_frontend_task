import type QuickLRU from 'quick-lru'
import type { PhotoApi } from '../libs/photo-api'
import type { SearchPhotosResult } from './types'
import { isAbortError, isHttpError } from '@tf-app/shared/api'
import { token } from 'ditox'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { normalizeHttpError } from '../libs/normalize-http-error'

type SearchResultStore = ReturnType<ReturnType<typeof createSearchResultStore>>

const normalizeQuery = (q: string) => q.trim().toLowerCase().replaceAll(/\s+/g, ' ')
const searchKey = (q: string, p: number) => `search:q=${normalizeQuery(q)}::page=${p}`

export const SEARCH_RESULT_STORE_TOKEN = token<SearchResultStore>('search-result-store')

export function createSearchResultStore(key: string, deps: {
  api: PhotoApi
  cache: QuickLRU<string, SearchPhotosResult>
}) {
  return defineStore(key, () => {
    const { api, cache } = deps
    const items = shallowRef<SearchPhotosResult>({
      items: [],
      total: 0,
      totalPages: 0,
    })
    const loading = ref(false)
    const error = ref<string | null>(null)

    const inflightRequests = new Map<string, Promise<SearchPhotosResult>>()

    async function search(
      { query, page, perPage }: { query: string, page: number, perPage: number },
      init?: RequestInit,
    ) {
      const q = (query ?? '').trim()
      if (!q.length) {
        items.value = {
          items: [],
          total: 0,
          totalPages: 0,
        }
        error.value = null
        loading.value = false
        return
      }

      const cacheKey = searchKey(q, page)

      const hit = cache.get(cacheKey)
      if (hit) {
        items.value = hit
        loading.value = false
        error.value = null
        return
      }

      if (inflightRequests.has(cacheKey)) {
        await inflightRequests.get(cacheKey)
        return
      }

      loading.value = true
      error.value = null

      const request = api.searchPhotos({ query, page, perPage }, init)
      inflightRequests.set(cacheKey, request)

      try {
        const result = await request
        cache.set(cacheKey, result)
        items.value = result
      }
      catch (e) {
        if (isAbortError(e))
          return
        if (isHttpError(e)) {
          error.value = normalizeHttpError(e)
        }
      }
      finally {
        inflightRequests.delete(cacheKey)
        loading.value = false
      }
    }

    return {
      items,
      loading,
      error,
      search,
    }
  })
}
