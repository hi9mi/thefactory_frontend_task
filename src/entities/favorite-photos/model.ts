import { ref } from 'vue'
import { defineStore } from 'pinia'

import { getItemFromLS, setItemToLS } from '@tf-app/shared/libs'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'

const LS_KEY = 'favorites'

export const useFavoritePhotosStore = defineStore('favoritePhotos', () => {
  const favoritePhotos = ref(getItemFromLS<Photo[]>(LS_KEY, []))

  function toggleFavoritePhoto(photo: Photo) {
    const favPhotoIndex = favoritePhotos.value.findIndex(favPhoto => favPhoto.id === photo.id)
    if (favPhotoIndex !== -1) {
      favoritePhotos.value.splice(favPhotoIndex, 1)
      notify({ title: 'Успех!', message: 'Фото добавлено в избранное', type: 'success' })
    }
    else {
      favoritePhotos.value.push(photo)
      notify({ title: 'Успех!', message: 'Фото удалено из избранного', type: 'success' })
    }

    setItemToLS(LS_KEY, favoritePhotos.value)
  }

  return { favoritePhotos, toggleFavoritePhoto }
})
