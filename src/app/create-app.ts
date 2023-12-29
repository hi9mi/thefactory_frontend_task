import './index.css'

import { createApp as createVueApp } from 'vue'

import { routesMap } from '@tf-app/pages'
import { installNProgress } from '@tf-app/shared/libs'

import { initWith } from './init-with'
import TfApp from './tf-app.vue'

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
  installNProgress(router)
  const isReady = router.isReady()
  const mount = app.mount

  return { isReady, mount }
}
