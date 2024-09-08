import { createAppRouter } from '@tf-app/routing'
import type { App } from 'vue'

import type { RouteRecordRaw } from 'vue-router'

interface Params {
  app: App
  routesMap: RouteRecordRaw[]
  baseUrl: string
}

export function withRouter({ app, routesMap, baseUrl }: Params) {
  const router = createAppRouter(routesMap, baseUrl)

  app.use(router)

  return router
}
