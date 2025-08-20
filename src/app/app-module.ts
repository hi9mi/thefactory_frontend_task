import type { DependencyModule } from '@tf-app/shared/di'
import type { Router } from 'vue-router'
import { createPhotoDetailsCache, PHOTO_DETAILS_CACHE } from '@tf-app/entities/details-photo'
import { createFavoritesRepoLS, FAVORITES_REPO } from '@tf-app/entities/favorite-photos'
import { createGalleryCache, GALLERY_CACHE } from '@tf-app/entities/gallery'
import * as api from '@tf-app/shared/api'
import { TOKENS } from '@tf-app/shared/di'
import { useNotificationsStore } from '@tf-app/shared/ui/feedback/tf-notification/model'

export function appModule(p: { router: Router, baseUrl: string }): DependencyModule {
  return (di) => {
    di.set(TOKENS.Router, p.router)
    di.set(TOKENS.Config, { baseUrl: p.baseUrl })

    di.set(TOKENS.Notifier, {
      success: (m: string, t?: string) => useNotificationsStore().success(m, t),
      error: (m: string, t?: string) => useNotificationsStore().error(m, t),
      info: (m: string, t?: string) => useNotificationsStore().info(m, t),
      warning: (m: string, t?: string) => useNotificationsStore().warning(m, t),
    })

    di.set(TOKENS.UnsplashAPI, {
      getRandomPhotos: () => api.getRandomPhotos(),
      getPhotos: ({ query, page }) => api.getSearchPhotos(query, page),
      getDetailsPhoto: id => api.getDetailsPhoto(id),
    })

    di.set(FAVORITES_REPO, createFavoritesRepoLS())
    di.set(GALLERY_CACHE, createGalleryCache())
    di.set(PHOTO_DETAILS_CACHE, createPhotoDetailsCache())
  }
}
