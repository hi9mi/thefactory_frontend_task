import type { RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('./**/index.ts', { import: 'default', eager: true })

const map = Object.values(modules)

export const routesMap = map.filter(isRouteModule).sort((a, b) => weightRoute(a.path) - weightRoute(b.path))

function isRouteModule(module: unknown): module is RouteRecordRaw {
  return typeof module === 'object' && module !== null && 'path' in module && 'components' in module
}

function weightRoute(path: string): number {
  if (path.includes('*'))
    return -1_000_000
  return path.split('/').reduce((w, segment) => {
    if (!segment)
      return w
    if (segment.startsWith(':'))
      return w + 1
    return w + 2
  }, 0)
}
