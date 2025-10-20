import type { AppRouter } from '@tf-app/routing'
import type { AppConfig } from '@tf-app/shared/config'
import type { Container } from 'ditox'
import { createFavoritesRepo, FAVORITES_REPO } from '@tf-app/entities/favorite-photos'
import { ROUTER_TOKEN } from '@tf-app/routing'
import { createUnsplashApi, UNSPLASH_API_TOKEN } from '@tf-app/shared/api'
import { APP_CONFIG_TOKEN } from '@tf-app/shared/config'
import { APP_STORAGE_TOKEN, createAppStorage, createLRUCacheManager, TOKENS } from '@tf-app/shared/libs'
import { createNotifier, NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import { injectable } from 'ditox'

export function appModule(container: Container, params: {
  config: AppConfig
  router: AppRouter
}) {
  container.bindValue(APP_CONFIG_TOKEN, params.config)
  // TODO: think about Navigation Module
  // container.bindFactory(NAV_TOKEN, injectable(createNavigation, ROUTER_TOKEN))
  container.bindValue(ROUTER_TOKEN, params.router)
  container.bindFactory(NOTIFIER_TOKEN, injectable(createNotifier))
  container.bindFactory(UNSPLASH_API_TOKEN, injectable(createUnsplashApi, APP_CONFIG_TOKEN), { scope: 'singleton' })
  container.bindValue(TOKENS.LRUCache, createLRUCacheManager())
  container.bindFactory(APP_STORAGE_TOKEN, injectable(createAppStorage, APP_CONFIG_TOKEN))
  container.bindFactory(FAVORITES_REPO, injectable(createFavoritesRepo, APP_STORAGE_TOKEN))
}
