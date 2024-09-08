import * as api from '@tf-app/shared/api'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'
import { useRouteQuery } from '@vueuse/router'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Photo, Photos } from '@tf-app/shared/api'

export const useGalleryStore = defineStore('gallery', () => {
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
      randomPhotos.value = await api.getRandomPhotos()
    }
    catch (error) {
      console.error('Failed to fetch random photos:', error)
      notify({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
    }
    isLoadingRandomPhotos.value = false
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
      photos.value = await api.getSearchPhotos(searchTerm.value, page.value)
    }
    catch (error) {
      console.error('Failed to fetch photos:', error)
      notify({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
    }
    isLoadingPhotos.value = false
  }

  return {
    randomPhotos,
    isLoadingPhotos,
    isLoadingRandomPhotos,
    photos,
    searchTerm,
    page,
    hasPhotos,
    hasNoResults,
    isSearchEmpty,
    fetchRandomPhotos,
    changeSearchTerm,
    changeCurrentPage,
    fetchPhotos,
  }
})
