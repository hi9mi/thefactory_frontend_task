import type { AppConfig } from '@tf-app/shared/config'
import type { Logger } from '@tf-app/shared/libs'
import type { App } from 'vue'
import { createAppRouter } from '@tf-app/routing'
import { setupGuards } from '@tf-app/routing/guards'

interface Params {
  app: App
  baseUrl: string
  config: AppConfig
  logger: Logger
}

export function initRouter({ app, baseUrl, config, logger }: Params) {
  const router = createAppRouter(baseUrl)

  setupGuards(router, { config, logger })

  app.use(router)

  return router
}
