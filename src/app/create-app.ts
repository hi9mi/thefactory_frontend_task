import { routesMap } from '@tf-app/pages'

import { registerAppBindings } from '@tf-app/shared/di/register-app-bindings'

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

  const isReady = router.isReady()
  const mount = app.mount

  return { isReady, mount }
}
