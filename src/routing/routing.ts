import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes = {
  gallery: {
    // TODO: add search route
    path: '/',
    name: 'gallery',
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
    routes: routesMap,
  })

  return router
}
