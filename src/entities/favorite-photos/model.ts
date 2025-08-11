import type { Photo } from '@tf-app/shared/api'
import { TOKENS, useResolver } from '@tf-app/shared/di'
import { usePersistLS } from '@tf-app/shared/libs'

import { useRouteQuery } from '@vueuse/router'
import { defineStore } from 'pinia'

const LS_KEY = 'favorites'

export const useFavoritePhotosStore = defineStore('favoritePhotos', () => {
  const favoritePhotos = usePersistLS<Photo[]>([], LS_KEY, true)
  const currentPage = useRouteQuery('page', '1', { mode: 'push', transform: Number })
  const resolve = useResolver()
  const notifier = resolve(TOKENS.Notifier)

  function toggleFavoritePhoto(photo: Photo) {
    const favPhotoIndex = favoritePhotos.value.findIndex(favPhoto => favPhoto.id === photo.id)
    if (favPhotoIndex !== -1) {
      favoritePhotos.value.splice(favPhotoIndex, 1)
      notifier.success('Photo successfully removed from favorites', 'Removed from favorites')
    }
    else {
      favoritePhotos.value.push(photo)
      notifier.success('Photo successfully added to favorites', 'Added to favorites')
    }
  }

  return { favoritePhotos, toggleFavoritePhoto, currentPage }
})
