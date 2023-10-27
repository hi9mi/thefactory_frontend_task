import { ref } from 'vue'
import { defineStore } from 'pinia'

import * as api from '@tf-app/shared/api'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'

export const useDetailsPhotoStore = defineStore('detailsPhoto', () => {
  const detailsPhoto = ref<Photo | null>(null)
  const isLoadingDetailsPhoto = ref(false)

  async function getDetailsPhoto(id: string) {
    isLoadingDetailsPhoto.value = true
    try {
      detailsPhoto.value = await api.getDetailsPhoto(id)
    }
    catch (error) {
      notify({ title: 'Ошибка при загрузке фотографии', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
    }
    isLoadingDetailsPhoto.value = false
  }

  return { detailsPhoto, isLoadingDetailsPhoto, getDetailsPhoto }
})
