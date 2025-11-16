import type { App } from 'vue'
import { createAppRouter } from '@tf-app/routing'
import NProgress from 'nprogress'

interface Params {
  app: App
  baseUrl: string
}

export function initRouter({ app, baseUrl }: Params) {
  const router = createAppRouter(baseUrl)

  app.use(router)

  router.beforeEach((to, from) => {
    if (to.path !== from.path)
      NProgress.start()
  })
  router.afterEach(() => {
    NProgress.done()
  })

  return router
}
