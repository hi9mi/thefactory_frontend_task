import type { AppConfig } from '@tf-app/shared/config'
import type { Container } from 'ditox'
import { createFavoritesRepo, FAVORITES_REPO } from '@tf-app/entities/favorite-photos'
import { createUnsplashApi, UNSPLASH_API_TOKEN } from '@tf-app/shared/api'
import { APP_CONFIG_TOKEN } from '@tf-app/shared/config'
import { APP_STORAGE_TOKEN, CACHE_TOKEN, createAppStorage, createLRUCache } from '@tf-app/shared/libs'
import { createNotifier, NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import { injectable } from 'ditox'

export function appModule(container: Container, params: {
  config: AppConfig
}) {
  container.bindValue(APP_CONFIG_TOKEN, params.config)
  container.bindFactory(NOTIFIER_TOKEN, injectable(createNotifier), { scope: 'singleton' })
  container.bindFactory(UNSPLASH_API_TOKEN, injectable(createUnsplashApi, APP_CONFIG_TOKEN), { scope: 'singleton' })
  container.bindFactory(APP_STORAGE_TOKEN, injectable(createAppStorage, APP_CONFIG_TOKEN), { scope: 'singleton' })
  container.bindFactory(FAVORITES_REPO, injectable(createFavoritesRepo, APP_STORAGE_TOKEN), { scope: 'singleton' })
  container.bindFactory(CACHE_TOKEN, () => createLRUCache({ maxSize: 1000 }), { scope: 'singleton' })
}
