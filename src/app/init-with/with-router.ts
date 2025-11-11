import type { App } from 'vue'

import { createAppRouter } from '@tf-app/routing'

interface Params {
  app: App
  baseUrl: string
}

export function withRouter({ app, baseUrl }: Params) {
  const router = createAppRouter(baseUrl)

  app.use(router)

  return router
}
