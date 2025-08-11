import type { UnsplashAPI } from '@tf-app/shared/di/tokens'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import * as api from '@tf-app/shared/api'
import { TOKENS } from '@tf-app/shared/di/tokens'
import { useNotificationsStore } from '@tf-app/shared/ui/feedback/tf-notification/model'
import { di } from './container'

function createUnsplashApi(): UnsplashAPI {
  return {
    getRandomPhotos: async () => api.getRandomPhotos(),
    getPhotos: async (params: { query: string, page: number }) => api.getSearchPhotos(params.query, params.page),
    getDetailsPhoto: async (id: string) => api.getDetailsPhoto(id),
  }
}

export function registerAppBindings(params: {
  app: App
  router: Router
  baseUrl: string
}): void {
  di.bindValue(TOKENS.Router, params.router)
  di.bindValue(TOKENS.Notifier, {
    success: (m, t) => useNotificationsStore().success(m, t),
    error: (m, t) => useNotificationsStore().error(m, t),
    info: (m, t) => useNotificationsStore().info(m, t),
    warning: (m, t) => useNotificationsStore().warning(m, t),
  })
  di.bindValue(TOKENS.UnsplashAPI, createUnsplashApi())

  // todo
  // di.bindValue(TOKENS.Config, createAppConfig())
}
