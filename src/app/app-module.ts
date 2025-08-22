import type { DependencyModule } from '@tf-app/shared/di'
import type { Router } from 'vue-router'
import { createFavoritesRepoLS, FAVORITES_REPO } from '@tf-app/entities/favorite-photos'
import { createUnsplashApi } from '@tf-app/shared/api'
import { TOKENS } from '@tf-app/shared/di'
import { createAppConfigFromEnv, createLRUCacheManager } from '@tf-app/shared/libs'
import { useNotificationsStore } from '@tf-app/shared/ui/feedback/tf-notification/model'

export function appModule(p: { router: Router, baseUrl: string }): DependencyModule {
  return (di) => {
    const cfg = createAppConfigFromEnv(import.meta.env)
    di.set(TOKENS.Router, p.router)

    di.set(TOKENS.Notifier, {
      success: (m: string, t?: string) => useNotificationsStore().success(m, t),
      error: (m: string, t?: string) => useNotificationsStore().error(m, t),
      info: (m: string, t?: string) => useNotificationsStore().info(m, t),
      warning: (m: string, t?: string) => useNotificationsStore().warning(m, t),
    })

    di.set(TOKENS.UnsplashAPI, createUnsplashApi(cfg))

    di.set(FAVORITES_REPO, createFavoritesRepoLS())
    di.set(TOKENS.LRUCache, createLRUCacheManager())
  }
}
