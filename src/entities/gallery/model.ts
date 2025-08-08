import type { Photo, Photos } from '@tf-app/shared/api'
import type { Notifier, UnsplashAPI } from '@tf-app/shared/di/tokens'

import { useRouteQuery } from '@vueuse/router'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export function createGalleryModel(deps: { api: UnsplashAPI, notify: Notifier }) {
  const useGalleryStore = defineStore('gallery', () => {
    const randomPhotos = ref<Photo[]>([])
    const isLoadingPhotos = ref(false)
    const isLoadingRandomPhotos = ref(false)
    const photos = ref<Photos | null>(null)

    const searchTerm = useRouteQuery('q', '', { mode: 'push', transform: (value: string) => value.trim() })
    const page = useRouteQuery('p', '1', { mode: 'push', transform: Number })

    const isSearchEmpty = computed(() => searchTerm.value.length === 0)
    const hasPhotos = computed(() => (photos.value?.total ?? 0) > 0)
    const hasNoResults = computed(() => !isLoadingPhotos.value && !hasPhotos.value && !isSearchEmpty.value)

    async function fetchRandomPhotos() {
      isLoadingRandomPhotos.value = true
      try {
        randomPhotos.value = await deps.api.getRandomPhotos()
      }
      catch (error) {
        console.error('Failed to fetch random photos:', error)
        deps.notify.error('Failed to fetch random photos', 'Error')
      }
      finally {
        isLoadingRandomPhotos.value = false
      }
    }

    function changeSearchTerm(newSearchTerm: string) {
      searchTerm.value = newSearchTerm
    }

    function changeCurrentPage(newPage: number) {
      page.value = newPage
    }

    async function fetchPhotos() {
      if (searchTerm.value.length === 0) {
        photos.value = null
        return
      }
      isLoadingPhotos.value = true
      try {
        photos.value = await deps.api.getPhotos({ query: searchTerm.value, page: Number(page.value ?? 1) })
      }
      catch (error) {
        console.error('Failed to fetch photos:', error)
        deps.notify.error('Failed to fetch search result photos', 'Error')
      }
      finally {
        isLoadingPhotos.value = false
      }
    }

    return {
      // state
      randomPhotos,
      isLoadingPhotos,
      isLoadingRandomPhotos,
      photos,
      searchTerm,
      page,
      // getters
      hasPhotos,
      hasNoResults,
      isSearchEmpty,
      // actions
      fetchRandomPhotos,
      changeSearchTerm,
      changeCurrentPage,
      fetchPhotos,
    }
  })

  return { useGalleryStore }
}
