import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export function createAppRouter(baseUrl: string) {
  const router = createRouter({
    history: createWebHistory(baseUrl),
    scrollBehavior(to, from, savedPosition) {
      if (to.meta.notPreserveScroll || from.meta.notPreserveScroll) {
        return false
      }
      if (savedPosition)
        return savedPosition
      return { top: 0 }
    },
    routes,
  })

  return router
}
