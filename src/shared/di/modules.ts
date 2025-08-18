import type { AppConfig, Notifier, UnsplashAPI } from '@tf-app/shared/di'
import type { DependencyModule } from '@tf-app/shared/di/container'
import type { Router } from 'vue-router'
import * as api from '@tf-app/shared/api'
import { TOKENS } from '@tf-app/shared/di'
import { useNotificationsStore } from '@tf-app/shared/ui/feedback/tf-notification/model'

export function configModule(cfg: AppConfig): DependencyModule {
  return (di) => {
    di.set(TOKENS.Config, cfg)
  }
}

export function routerModule(router: Router): DependencyModule {
  return (di) => {
    di.set(TOKENS.Router, router)
  }
}

export function notifierModule(): DependencyModule {
  return (di) => {
    const n: Notifier = {
      success: (m, t) => useNotificationsStore().success(m, t),
      error: (m, t) => useNotificationsStore().error(m, t),
      info: (m, t) => useNotificationsStore().info(m, t),
      warning: (m, t) => useNotificationsStore().warning(m, t),
    }
    di.set(TOKENS.Notifier, n)
  }
}

export function unsplashModule(): DependencyModule {
  return (di) => {
    const svc: UnsplashAPI = {
      getRandomPhotos: () => api.getRandomPhotos(),
      getPhotos: ({ query, page }) => api.getSearchPhotos(query, page),
      getDetailsPhoto: id => api.getDetailsPhoto(id),
    }
    di.set(TOKENS.UnsplashAPI, svc)
  }
}
