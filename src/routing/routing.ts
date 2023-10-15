import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes = {
  gallery: {
    path: '/',
    name: 'gallery',
  },
  photoPage: {
    path: '/:id',
    name: 'photo-page',
  },
  favorites: {
    path: '/favorites',
    name: 'favorites',
  },
}

export function createAppRouter(routesMap: RouteRecordRaw[], baseUrl: string) {
  const router = createRouter({
    history: createWebHistory(baseUrl),
    routes: routesMap,
  })

  return router
}
