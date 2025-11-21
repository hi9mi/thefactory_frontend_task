import type { AppConfig } from '@tf-app/shared/config'
import type { App } from 'vue'
import { createAppRouter } from '@tf-app/routing'
import { setupGuards } from '@tf-app/routing/guards'

interface Params {
  app: App
  baseUrl: string
  config: AppConfig
}

export function initRouter({ app, baseUrl, config }: Params) {
  const router = createAppRouter(baseUrl)

  setupGuards(router, { config })

  app.use(router)

  return router
}
