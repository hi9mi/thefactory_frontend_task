import type QuickLRU from 'quick-lru'
import type { PhotoApi } from '../libs/photo-api'
import type { PhotoListItem } from './types'
import { isAbortError, isHttpError } from '@tf-app/shared/api'
import { token } from 'ditox'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { normalizeHttpError } from '../libs/normalize-http-error'

const randomFeedKey = (count: number) => `gallery:count=${count}`

type RandomFeedStore = ReturnType<ReturnType<typeof createRandomFeedStore>>

export const RANDOM_FEED_STORE_TOKEN = token<RandomFeedStore>('random-feed-store')

export function createRandomFeedStore(key: string, deps: {
  api: PhotoApi
  cache: QuickLRU<string, PhotoListItem[]>
}) {
  return defineStore(key, () => {
    const { api, cache } = deps
    const items = shallowRef<PhotoListItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const inflightRequests = new Map<string, Promise<PhotoListItem[]>>()

    async function fetchPhotos(count = 18, init?: RequestInit) {
      const cacheKey = randomFeedKey(count)
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

      const request = api.getRandomFeed(count, init)
      inflightRequests.set(cacheKey, request)

      try {
        const result = await request
        items.value = result
        error.value = null
        cache.set(cacheKey, result)
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
      fetchPhotos,
      items,
      loading,
      error,
    }
  })
}
