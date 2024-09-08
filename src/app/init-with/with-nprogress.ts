import NProgress from 'nprogress'
import type { Router } from 'vue-router'

export function withNProgress(router: Router) {
  router.beforeEach((to, from) => {
    if (to.path !== from.path)
      NProgress.start()
  })
  router.afterEach(() => {
    NProgress.done()
  })
}
