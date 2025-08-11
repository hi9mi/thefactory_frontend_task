import { routesMap } from '@tf-app/pages'

import { di, registerAppBindings, RESOLVER } from '@tf-app/shared/di'

import { createApp as createVueApp } from 'vue'

import { initWith } from './init-with'
import TfApp from './tf-app.vue'
import './styles/index.css'

interface Params {
  baseUrl: string
  strict: boolean
  performance: boolean
}

export function createApp({ baseUrl, performance }: Params) {
  const app = createVueApp(TfApp)
  app.config.performance = performance

  initWith.pinia(app)
  const router = initWith.router({ app, routesMap, baseUrl })
  initWith.nprogress(router)

  registerAppBindings({ app, router, baseUrl })
  app.provide(RESOLVER, di.resolve.bind(di))

  const isReady = router.isReady()
  const mount = app.mount

  return { isReady, mount }
}
