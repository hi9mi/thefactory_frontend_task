import { createAppConfigFromEnv } from '@tf-app/shared/config'
import { createDiPlugin } from '@tf-app/shared/libs'
import { LOGGER_TOKEN } from '@tf-app/shared/libs/logger/logger'
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

    const rootContainer = createContainer()

    appModule(rootContainer, { config })
    const rootLogger = rootContainer.resolve(LOGGER_TOKEN)

    const logger = rootContainer.resolve(LOGGER_TOKEN).child('bootstrap')

    const { router } = initPlugins({ app, baseUrl, config, logger: rootLogger })
    logger.info('app info', {
      __APP_VERSION__,
      __BUILD_TIME__,
    })
    app.use(createDiPlugin(rootContainer))

    logger.info('Test info')
    logger.warn('Test warn')
    logger.error('Test error')

    return {
      isReady: router.isReady(),
      mount: (el: string | Element) => {
        const mountTimer = logger.timer('mount')
        const vm = app.mount(el)
        mountTimer.end()
        logger.info('app mounted', { el: typeof el === 'string' ? el : '#el' })

        return vm
      },
    }
  }
  catch (error) {
    console.error('[Error] Failed to create app config:', error)
    throw error
  }
}
