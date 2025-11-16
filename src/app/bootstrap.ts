import { createAppConfigFromEnv } from '@tf-app/shared/config'
import { createDiPlugin } from '@tf-app/shared/libs'
import { createContainer } from 'ditox'
import { createApp as createVueApp } from 'vue'
import { appModule } from './app-module'
import { initPlugins } from './init-plugins'
import TfApp from './tf-app.vue'
import './styles/index.css'

interface Params {
  baseUrl: string
  strict: boolean
  performance: boolean
}

export function bootstrap({ baseUrl, performance }: Params) {
  try {
    const config = createAppConfigFromEnv(import.meta.env)

    const app = createVueApp(TfApp)
    app.config.performance = performance
    const { router } = initPlugins({ app, baseUrl, config })

    const rootContainer = createContainer()
    appModule(rootContainer, { config })

    app.use(createDiPlugin(rootContainer))

    return { isReady: router.isReady(), mount: (el: string | Element) => app.mount(el) }
  }
  catch (error) {
    console.error('[Error] Failed to create app config:', error)
    throw error
  }
}
