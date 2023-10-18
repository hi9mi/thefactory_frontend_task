import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import * as api from '@tf-app/shared/api'

export const useGalleryStore = defineStore('gallery', () => {
  const randomPhotos = ref<Photo[]>([])
  const isLoadingRandomPhotos = ref(false)
  const photos = ref<Photo[] | null>(null)
  const isLoadingPhotos = ref(false)

  async function getRandomPhotos() {
    isLoadingRandomPhotos.value = true
    randomPhotos.value = await api.getRandomPhotos()
    isLoadingRandomPhotos.value = false
  }

  async function getSearchPhotos(searchQuery: string) {
    isLoadingPhotos.value = true
    photos.value = await api.getSearchPhotos(searchQuery)
    isLoadingPhotos.value = false
  }

  const isLoadingGallery = computed(() => isLoadingPhotos.value || isLoadingRandomPhotos.value)

  return { randomPhotos, photos, isLoadingGallery, getRandomPhotos, getSearchPhotos }
})
