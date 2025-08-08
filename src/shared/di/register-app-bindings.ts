import type { Notifier, UnsplashAPI } from '@tf-app/shared/di/tokens'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import * as api from '@tf-app/shared/api'
import { TOKENS } from '@tf-app/shared/di/tokens'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'
import { di } from './container'

function createNotifier(): Notifier {
  return {
    success: (message, title) => {
      notify({ type: 'success', message, title })
    },
    error: (message, title) => {
      notify({ type: 'error', message, title })
    },
  }
}

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
  di.bindValue(TOKENS.Notifier, createNotifier())
  di.bindValue(TOKENS.UnsplashAPI, createUnsplashApi())

  // todo
  // di.bindValue(TOKENS.Config, createAppConfig())

  params.app.provide('$di', di)
}
