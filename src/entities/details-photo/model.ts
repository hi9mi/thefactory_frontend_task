import type QuickLRU from 'quick-lru'
import type { DetailsPhoto, PhotoDetailsGateway } from './gateway'
import { isAbortError, isHttpError } from '@tf-app/shared/api'
import { token } from 'ditox'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

type DetailsStore = ReturnType<ReturnType<typeof createPhotoDetailsStore>>

export const DETAILS_STORE_TOKEN = token<DetailsStore>('DetailsStore')

// TODO: refactor
export function createPhotoDetailsStore(key: string, deps: { gateway: PhotoDetailsGateway, cache: QuickLRU<string, DetailsPhoto> }) {
  return defineStore(key, () => {
    const { gateway, cache } = deps

    const state = reactive<{
      item: DetailsPhoto | null
      loading: boolean
      error: string | null
    }>({
      item: null,
      loading: false,
      error: null,
    })
    const inflight = new Map<string, Promise<DetailsPhoto>>()

    const fetch = async (id: string, init?: RequestInit) => {
      state.loading = true
      state.error = null
      const hit = cache.get(id)
      if (hit) {
        state.item = hit
        state.loading = false
        state.error = null
        return
      }

      if (inflight.has(id)) {
        await inflight.get(id)
        return
      }

      const promise = gateway.getById(id, init)
      inflight.set(id, promise)
      try {
        const data = await promise
        state.item = data
        state.loading = false
        state.error = null
        cache.set(id, data)
      }
      catch (error) {
        if (isAbortError(error))
          return
        if (isHttpError(error)) {
          if (error.errors?.length)
            state.error = error.errors.join(', ')
          else if (error.status === 401)
            state.error = 'Invalid access token'
          else if (error.status === 403)
            state.error = 'Forbidden (check permissions/rate limit)'
          else if (error.status === 404)
            state.error = 'Not found'
          else if (error.status === 400)
            state.error = 'Bad request'
          else if (error.status >= 500)
            state.error = 'Server error, try later'
          if (error.rateLimit?.remaining === 0)
            state.error = 'Rate limit exceeded, please try again later'
        }
        else if (error instanceof Error) {
          state.error = error?.message
        }
        else {
          state.error = 'Unknown error'
        }
      }
      finally {
        inflight.delete(id)
      }
    }

    // simple prefetch
    const prefetch = async (id: string) => {
      if (inflight.has(id))
        return

      const promise = gateway.getById(id)
      inflight.set(id, promise)
      try {
        await promise
      }
      catch (error) {
        console.error('[Details Photo Entity ERROR]: failed prefetch', error)
      }
      finally {
        inflight.delete(id)
      }
    }

    const item = computed(() => state.item)
    const loading = computed(() => state.loading)
    const error = computed(() => state.error)

    return {
      item,
      loading,
      error,
      fetch,
      prefetch,
    }
  })
}
