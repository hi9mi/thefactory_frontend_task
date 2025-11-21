import type { RouteLocationNormalized } from 'vue-router'
import NProgress from 'nprogress'

export function nprogressGuard(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (to.path !== from.path)
    NProgress.start()
}

export function nprogressGuardCleanup() {
  NProgress.done()
}
