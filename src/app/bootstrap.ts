import { routesMap } from '@tf-app/pages'

import { applyModules, createDI, createDiPlugin } from '@tf-app/shared/di'

import { createApp as createVueApp } from 'vue'
import { appModule } from './app-module'
import { initWith } from './init-with'
import TfApp from './tf-app.vue'
import './styles/index.css'

interface Params {
  baseUrl: string
  strict: boolean
  performance: boolean
}

export function bootstrap({ baseUrl, performance }: Params) {
  const app = createVueApp(TfApp)
  app.config.performance = performance

  initWith.pinia(app)
  const router = initWith.router({ app, routesMap, baseUrl })
  initWith.nprogress(router)

  const rootDi = createDI()

  applyModules(rootDi, appModule({
    router,
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  }))

  app.use(createDiPlugin(rootDi))

  const isReady = router.isReady()
  const mount = app.mount

  return { isReady, mount }
}
