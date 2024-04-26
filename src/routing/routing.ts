import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes = {
  gallery: {
    path: '/',
    name: 'gallery',
  },
  search: {
    path: '/search',
    name: 'search',
  },
  photoPage: {
    main: {
      path: '/:id',
      name: 'photo-page',
    },
    fullPhoto: {
      path: 'full-photo',
      name: 'fullPhoto',
    },
  },
  favorites: {
    path: '/favorites',
    name: 'favorites',
  },
} as const

export function createAppRouter(routesMap: RouteRecordRaw[], baseUrl: string) {
  const router = createRouter({
    history: createWebHistory(baseUrl),
    scrollBehavior: (_, __, savedPosition) => (savedPosition || { top: 0, left: 0 }),
    routes: routesMap,
  })

  return router
}
