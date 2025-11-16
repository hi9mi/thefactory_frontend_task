import type QuickLRU from 'quick-lru'
import type { PhotoApi } from '../libs/photo-api'
import type { PhotoDetails } from './types'
import { isAbortError, isHttpError } from '@tf-app/shared/api'
import { token } from 'ditox'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { normalizeHttpError } from '../libs/normalize-http-error'

type DetailsStore = ReturnType<ReturnType<typeof createPhotoDetailsStore>>

export const PHOTO_DETAILS_STORE_TOKEN = token<DetailsStore>('photo-details-store')

export function createPhotoDetailsStore(key: string, deps: { api: PhotoApi, cache: QuickLRU<string, PhotoDetails> }) {
  return defineStore(key, () => {
    const { api, cache } = deps
    const item = shallowRef<PhotoDetails | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const inflight = new Map<string, Promise<PhotoDetails>>()

    const fetch = async (id: string, init?: RequestInit) => {
      loading.value = true
      error.value = null
      const hit = cache.get(id)
      if (hit) {
        item.value = hit
        loading.value = false
        error.value = null
        return
      }

      if (inflight.has(id)) {
        await inflight.get(id)
        return
      }

      const promise = api.getDetailsPhoto(id, init)
      inflight.set(id, promise)
      try {
        const result = await promise
        item.value = result
        loading.value = false
        error.value = null
        cache.set(id, result)
      }
      catch (e) {
        if (isAbortError(e))
          return
        if (isHttpError(e)) {
          error.value = normalizeHttpError(e)
        }
      }
      finally {
        inflight.delete(id)
      }
    }

    const prefetch = async (id: string) => {
      if (cache.has(id) || item.value?.id === id || inflight.has(id))
        return

      const promise = api.getDetailsPhoto(id)
      inflight.set(id, promise)
      try {
        const result = await promise
        cache.set(id, result)
      }
      catch (error) {
        console.error('[Details Photo Entity ERROR]: failed prefetch', error)
      }
      finally {
        inflight.delete(id)
      }
    }

    return {
      item,
      loading,
      error,
      fetch,
      prefetch,
    }
  })
}
