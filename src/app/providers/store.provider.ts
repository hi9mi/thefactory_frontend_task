import type { Container } from 'ditox'

import {
  createFavoritePhotosStore,
  createPhotoApi,
  createPhotoDetailsStore,
  createRandomFeedStore,
  createSearchResultStore,
  FAVORITE_PHOTO_STORE_TOKEN,
  PHOTO_DETAILS_STORE_TOKEN,
  RANDOM_FEED_STORE_TOKEN,
  SEARCH_RESULT_STORE_TOKEN,
} from '@tf-app/entities/photo'
import { UNSPLASH_API_TOKEN } from '@tf-app/shared/api'
import { CACHE_TOKEN } from '@tf-app/shared/libs'
import { injectable } from 'ditox'

export function storeProvider(container: Container) {
  container.bindFactory(
    RANDOM_FEED_STORE_TOKEN,
    injectable((cache, api) => {
      const useRandomStore = createRandomFeedStore('feed', { cache: cache as any, api: createPhotoApi(api) })
      return useRandomStore()
    }, CACHE_TOKEN, UNSPLASH_API_TOKEN),
    { scope: 'singleton' },
  )

  container.bindFactory(
    SEARCH_RESULT_STORE_TOKEN,
    injectable((cache, api) => {
      const useGalleryStore = createSearchResultStore('search', { cache: cache as any, api: createPhotoApi(api) })
      return useGalleryStore()
    }, CACHE_TOKEN, UNSPLASH_API_TOKEN),
    { scope: 'singleton' },
  )

  container.bindFactory(
    FAVORITE_PHOTO_STORE_TOKEN,
    () => {
      const useFavoritesStore = createFavoritePhotosStore('favorites')
      return useFavoritesStore()
    },
    { scope: 'singleton' },
  )

  container.bindFactory(
    PHOTO_DETAILS_STORE_TOKEN,
    injectable((cache, api) => {
      const useDetailsStore = createPhotoDetailsStore('details', { cache: cache as any, api: createPhotoApi(api) })
      return useDetailsStore()
    }, CACHE_TOKEN, UNSPLASH_API_TOKEN),
    { scope: 'singleton' },
  )
}
