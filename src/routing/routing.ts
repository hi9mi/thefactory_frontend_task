import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

interface Routes {
  [key: string]: {
    path: string
    name: string
    preserveScroll?: boolean
    children?: Routes
  }
}

export const routes = {
  gallery: {
    path: '/',
    name: 'gallery',
    preserveScroll: true,
  },
  search: {
    path: '/search',
    name: 'search',
    preserveScroll: true,
  },
  photoPage: {
    path: '/:id',
    name: 'photoPage',
    preserveScroll: true,
    children: {
      fullPhoto: {
        path: 'full',
        name: 'fullPhoto',
        preserveScroll: true,
      },
    },
  },
  favorites: {
    path: '/favorites',
    name: 'favorites',
    preserveScroll: true,
  },
} satisfies Routes

export function createAppRouter(routesMap: RouteRecordRaw[], baseUrl: string) {
  const router = createRouter({
    history: createWebHistory(baseUrl),
    scrollBehavior(to, from, savedPosition) {
      const isSameRoute = to.path === from.path
      const isPreserveScroll = !isSameRoute && shouldPreserveScroll(to, from)
      const defaultScrollPosition = { top: 0, left: 0 }
      return isPreserveScroll ? (savedPosition ?? defaultScrollPosition) : defaultScrollPosition
    },

    routes: routesMap,
  })

  return router
}

type RoutesKeys = keyof typeof routes

function shouldPreserveScroll(
  to: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded,
) {
  const fromRoute = routes[from.name as RoutesKeys]
  const toRoute = routes[to.name as RoutesKeys]

  return toRoute?.preserveScroll ?? fromRoute?.preserveScroll ?? false
}
