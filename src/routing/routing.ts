import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

interface Routes {
  [key: string]: {
    path: string
    name: string
    children?: Routes
  }
}

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
    path: '/:id',
    name: 'photoPage',
    children: {
      fullPhoto: {
        path: 'full',
        name: 'fullPhoto',
      },
    },
  },
  favorites: {
    path: '/favorites',
    name: 'favorites',
  },
} satisfies Routes

export function createAppRouter(routesMap: RouteRecordRaw[], baseUrl: string) {
  const router = createRouter({
    history: createWebHistory(baseUrl),
    scrollBehavior(_, __, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      else {
        return { top: 0 }
      }
    },
    routes: routesMap,
  })

  return router
}
