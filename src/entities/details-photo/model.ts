import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as api from '@tf-app/shared/api'

export const useDetailsPhotoStore = defineStore('detailsPhoto', () => {
  const detailsPhoto = ref<Photo | null>(null)
  const isLoadingDetailsPhoto = ref(false)

  async function getDetailsPhoto(id: string) {
    isLoadingDetailsPhoto.value = true
    detailsPhoto.value = await api.getDetailsPhoto(id)
    isLoadingDetailsPhoto.value = false
  }

  return { detailsPhoto, isLoadingDetailsPhoto, getDetailsPhoto }
})
