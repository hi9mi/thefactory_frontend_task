import type { AppConfig } from '@tf-app/shared/config'
import type { App } from 'vue'
import { initPinia } from './init-pinia'
import { initRouter } from './init-router'

interface Params { app: App, config: AppConfig, baseUrl: string }

export function initPlugins({ app, baseUrl }: Params) {
  initPinia(app)
  const router = initRouter({ app, baseUrl })

  return { router }
}
