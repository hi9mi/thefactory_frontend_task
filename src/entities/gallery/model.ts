import { computed, ref, watch } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { defineStore } from 'pinia'

import type { Photo, Photos } from '@tf-app/shared/api'
import * as api from '@tf-app/shared/api'
import { debounce } from '@tf-app/shared/libs'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'

export const useGalleryStore = defineStore('gallery', () => {
  const randomPhotos = ref<Photo[]>([])
  const isLoadingPhotos = ref(false)
  const photos = ref<Photos | null>(null)
  const searchQuery = useRouteQuery<string>('search', '', { mode: 'replace' })
  const page = useRouteQuery('page', '1', { mode: 'push', transform: Number })

  const hasPhotos = computed(() => (photos.value?.total ?? 0) > 0)
  const hasNoResults = computed(() => !hasPhotos.value && searchQuery.value.trim().length > 1)

  async function fetchRandomPhotos() {
    isLoadingPhotos.value = true
    try {
      randomPhotos.value = await api.getRandomPhotos()
    }
    catch (error) {
      notify({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
    }
    isLoadingPhotos.value = false
  }

  function changeSearchQuery(newSearchQuery: string) {
    searchQuery.value = newSearchQuery
    changeCurrentPage(1)
  }

  function changeCurrentPage(newPage: number) {
    page.value = newPage
  }

  async function fetchPhotos() {
    try {
      photos.value = await api.getSearchPhotos(searchQuery.value, page.value)
    }
    catch (error) {
      notify({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
    }
  }

  const [debouncedFetchPhotos, teardownDebouncedFetchPhotos] = debounce(fetchPhotos, 500)

  watch(() => [searchQuery.value, page.value], () => {
    if (searchQuery.value.trim().length > 0) {
      debouncedFetchPhotos()
    }
    else {
      teardownDebouncedFetchPhotos()
      photos.value = null
    }
  }, { immediate: true })

  return {
    randomPhotos,
    isLoadingPhotos,
    photos,
    searchQuery,
    page,
    hasPhotos,
    hasNoResults,
    fetchRandomPhotos,
    changeSearchQuery,
    changeCurrentPage,
    fetchPhotos,
  }
})
