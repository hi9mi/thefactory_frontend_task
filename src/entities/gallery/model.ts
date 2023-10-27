import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import * as api from '@tf-app/shared/api'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'

export const useGalleryStore = defineStore('gallery', () => {
  const randomPhotos = ref<Photo[]>([])
  const isLoadingRandomPhotos = ref(false)
  const photos = ref<{ results: Photo[]; total: number; total_pages: number } | null>(null)
  const isLoadingPhotos = ref(false)

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
    isLoadingPhotos.value = true
    try {
      photos.value = await api.getSearchPhotos(query, page)
    }
    catch (error) {
      notify({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
    }
    isLoadingPhotos.value = false
  }

  const isLoadingGallery = computed(() => isLoadingPhotos.value || isLoadingRandomPhotos.value)

  return { randomPhotos, photos, isLoadingGallery, getRandomPhotos, getPhotos }
})
