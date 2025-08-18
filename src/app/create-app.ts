import { routesMap } from '@tf-app/pages'

import { applyModules, createDI, createDiPlugin } from '@tf-app/shared/di'

import { configModule, notifierModule, routerModule, unsplashModule } from '@tf-app/shared/di/modules'

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

  const rootDi = createDI()

  applyModules(
    rootDi,
    configModule({ baseUrl: import.meta.env.VITE_UNSPLASH_API_URL ?? '' }),
    routerModule(router),
    notifierModule(),
    unsplashModule(),
  )

  app.use(createDiPlugin(rootDi))

  const isReady = router.isReady()
  const mount = app.mount

  return { isReady, mount }
}
