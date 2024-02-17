import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteQuery } from '@vueuse/router'
import { defineStore } from 'pinia'

import * as api from '@tf-app/shared/api'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'

export const useGalleryStore = defineStore('gallery', () => {
  const route = useRoute()

  const randomPhotos = ref<Photo[]>([])
  const isLoadingRandomPhotos = ref(false)
  const photos = ref<{ results: Photo[]; total: number; total_pages: number } | null>(null)
  const currentPage = useRouteQuery('p', '1', { mode: 'push', transform: Number })

  async function getRandomPhotos() {
    isLoadingRandomPhotos.value = true
    try {
      randomPhotos.value = await api.getRandomPhotos()
    }
    catch (error) {
      notify({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
    }
    isLoadingRandomPhotos.value = false
  }

  async function getPhotos(query: string, page: number) {
    try {
      photos.value = await api.getSearchPhotos(query, page)
    }
    catch (error) {
      notify({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
    }
  }

  function changeCurrentPage(newPage: number) {
    currentPage.value = newPage
  }

  watch(currentPage, (page) => {
    const searchQuery = route.query.q as string
    getPhotos(searchQuery, page)
  })

  return { randomPhotos, photos, isLoadingRandomPhotos, currentPage, getRandomPhotos, getPhotos, changeCurrentPage }
})
