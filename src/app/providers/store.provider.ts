import type { Container } from 'ditox'
import { createPhotoDetailsGateway, createPhotoDetailsStore, DETAILS_STORE_TOKEN } from '@tf-app/entities/details-photo'
import { createFavoritesStore, FAVORITES_STORE_TOKEN } from '@tf-app/entities/favorite-photos'
import { createGalleryGateway, createGalleryRandomStore, createGalleryStore, GALLERY_RANDOM_STORE_TOKEN, GALLERY_SEARCH_STORE_TOKEN } from '@tf-app/entities/gallery'
import { UNSPLASH_API_TOKEN } from '@tf-app/shared/api'
import { CACHE_TOKEN } from '@tf-app/shared/libs'
import { injectable } from 'ditox'

export function storeProvider(container: Container) {
  container.bindFactory(
    GALLERY_RANDOM_STORE_TOKEN,
    injectable((cache, api) => {
      const useRandomStore = createGalleryRandomStore('random', { cache: cache as any, gateway: createGalleryGateway(api) })
      return useRandomStore()
    }, CACHE_TOKEN, UNSPLASH_API_TOKEN),
    { scope: 'singleton' },
  )

  container.bindFactory(
    GALLERY_SEARCH_STORE_TOKEN,
    injectable((cache, api) => {
      const useGalleryStore = createGalleryStore('search', { cache: cache as any, gateway: createGalleryGateway(api) })
      return useGalleryStore()
    }, CACHE_TOKEN, UNSPLASH_API_TOKEN),
    { scope: 'singleton' },
  )

  container.bindFactory(
    FAVORITES_STORE_TOKEN,
    () => {
      const useFavoritesStore = createFavoritesStore('favorites')
      return useFavoritesStore()
    },
    { scope: 'singleton' },
  )

  container.bindFactory(
    DETAILS_STORE_TOKEN,
    injectable((cache, api) => {
      const useDetailsStore = createPhotoDetailsStore('details', { cache: cache as any, gateway: createPhotoDetailsGateway(api) })
      return useDetailsStore()
    }, CACHE_TOKEN, UNSPLASH_API_TOKEN),
    { scope: 'singleton' },
  )
}
