import type { Photo } from '@tf-app/shared/api'
import { usePersistLS } from '@tf-app/shared/libs'

import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'
import { useRouteQuery } from '@vueuse/router'
import { defineStore } from 'pinia'

const LS_KEY = 'favorites'

export const useFavoritePhotosStore = defineStore('favoritePhotos', () => {
  const favoritePhotos = usePersistLS<Photo[]>([], LS_KEY, true)
  const currentPage = useRouteQuery('page', '1', { mode: 'push', transform: Number })

  function toggleFavoritePhoto(photo: Photo) {
    const favPhotoIndex = favoritePhotos.value.findIndex(favPhoto => favPhoto.id === photo.id)
    if (favPhotoIndex !== -1) {
      favoritePhotos.value.splice(favPhotoIndex, 1)
      notify({ title: 'Успех!', message: 'Фото удалено из избранного', type: 'success' })
    }
    else {
      favoritePhotos.value.push(photo)
      notify({ title: 'Успех!', message: 'Фото добавлено в избранное', type: 'success' })
    }
  }

  return { favoritePhotos, toggleFavoritePhoto, currentPage }
})
