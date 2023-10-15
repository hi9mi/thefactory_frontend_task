import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getItemFromLS, setItemToLS } from '@tf-app/shared/libs'

const LS_KEY = 'favorites'

export const useFavoritePhotosStore = defineStore('favoritePhotos', () => {
  const favoritePhotos = ref(getItemFromLS<Photo[]>(LS_KEY, []))

  function toggleFavoritePhoto(photo: Photo) {
    const favPhotoIndex = favoritePhotos.value.findIndex(favPhoto => favPhoto.id === photo.id)
    if (favPhotoIndex !== -1)
      favoritePhotos.value.splice(favPhotoIndex, 1)
    else
      favoritePhotos.value.push(photo)

    setItemToLS(LS_KEY, favoritePhotos.value)
  }

  return { favoritePhotos, toggleFavoritePhoto }
})
