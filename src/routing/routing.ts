import type { HistoryState, LocationQueryRaw, RouteParamsRawGeneric, RouteRecordRaw } from 'vue-router'
import { token } from 'ditox'
import { createRouter, createWebHistory } from 'vue-router'

export interface AppRoute {
  [key: string]: {
    path: string
    name: string
    children?: AppRoute
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
} as const

type ExactRoute = typeof routes
type RouteKey = keyof ExactRoute
type KnownPath = ExactRoute[RouteKey]['path']
type AnyPath = (string & {})
type RoutePath = KnownPath | AnyPath
type RouteName = ExactRoute[RouteKey]['name']
interface GotoOptions {
  name: RouteName
  params?: RouteParamsRawGeneric
  query?: LocationQueryRaw
  path?: RoutePath
  hash?: string
  state?: HistoryState
  mode: 'push' | 'replace'
}

export const RouteBuilder = {
  gallery: () => ({ name: routes.gallery.name }),
  search: (q?: string) => ({ name: routes.search.name, query: q ? { q } : undefined }),
  photoPage: (id: string | number) => ({ name: routes.photoPage.name, params: { id } }),
  fullPhoto: (id: string | number) => ({ name: routes.photoPage.children.fullPhoto.name, params: { id } }),
  favorites: () => ({ name: routes.favorites.name }),
}

export function createAppRouter(routesMap: RouteRecordRaw[], baseUrl: string) {
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
    routes: routesMap,
  })

  const goTo = (path: RoutePath, options?: GotoOptions) => {
    if (!options) {
      return router.push(path)
    }
    else {
      const { mode, ...restOpts } = options
      return router[mode]({
        ...restOpts,
      })
    }
  }

  return Object.assign(router, { goTo, RouteBuilder })
}

export type AppRouter = ReturnType<typeof createAppRouter>

export const ROUTER_TOKEN = token<AppRouter>()
