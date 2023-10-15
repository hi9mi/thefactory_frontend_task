import type { RouteRecordRaw } from 'vue-router'

const routes = import.meta.glob('./**/index.ts', { import: 'default', eager: true })

export const routesMap = Object.values(routes) as RouteRecordRaw[]
