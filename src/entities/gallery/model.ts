import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'

import { routes } from '@tf-app/routing'
import * as api from '@tf-app/shared/api'
import { debounce } from '@tf-app/shared/libs'

export const useGalleryStore = defineStore('gallery', () => {
  const router = useRouter()
  const randomPhotos = ref<Photo[]>([])
  const isLoadingRandomPhotos = ref(false)
  const photos = ref<Photo[]>([])
  const isLoadingPhotos = ref(false)
  const searchQuery = ref('')

  async function getRandomPhotos() {
    isLoadingRandomPhotos.value = true
    randomPhotos.value = await api.getRandomPhotos()
    isLoadingRandomPhotos.value = false
  }

  async function getSearchPhotos() {
    photos.value = await api.getSearchPhotos(searchQuery.value)
  }

  const [getSearchPhotosDebounced, teardownGetSearchPhotos] = debounce(getSearchPhotos, 500)

  const isLoadingGallery = computed(() => isLoadingPhotos.value || isLoadingRandomPhotos.value)

  watch(searchQuery, async (searchQuery) => {
    if (searchQuery.trim().length > 0) {
      isLoadingPhotos.value = true
      router.push({ path: routes.gallery.path, query: { q: searchQuery }, replace: true })
      await getSearchPhotosDebounced()
      isLoadingPhotos.value = false
    }
    else {
      photos.value = []
      teardownGetSearchPhotos()
    }
  })

  return { randomPhotos, photos, isLoadingGallery, searchQuery, getRandomPhotos }
})
