import type { AppConfig } from '@tf-app/shared/config'
import type { Logger } from '@tf-app/shared/libs'
import type { App } from 'vue'
import { initPinia } from './init-pinia'
import { initRouter } from './init-router'

interface Params { app: App, config: AppConfig, baseUrl: string, logger: Logger }

export function initPlugins({ app, baseUrl, config, logger }: Params) {
  initPinia(app)
  const router = initRouter({ app, baseUrl, config, logger })

  return { router }
}
