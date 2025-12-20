import { createAppConfigFromEnv } from '@tf-app/shared/config'
import { createDiPlugin, LOGGER_TOKEN } from '@tf-app/shared/libs'
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
    const bootstrapLogger = rootLogger.child('Bootstrap')

    const { router } = initPlugins({ app, baseUrl, config, logger: rootLogger })
    bootstrapLogger.info({
      title: 'AppInfo',
      msg: `App version ${__APP_VERSION__} built on ${__BUILD_TIME__}`,
    })
    app.use(createDiPlugin(rootContainer))

    globalThis.addEventListener('unhandledrejection', (event) => {
      event.preventDefault()
      bootstrapLogger.error({
        title: 'UnhandledRejection',
        msg: 'UnhandledRejection',
        error: event.reason,
      })
    })

    bootstrapLogger.info({
      title: 'App config',
      msg: 'App config',
      data: config,
    })
    bootstrapLogger.warn({
      title: 'App config',
      msg: 'App config',
      data: config,
    })
    bootstrapLogger.error({
      title: 'App config',
      msg: 'App config',
      error: new Error('App config'),
    })

    return {
      isReady: router.isReady(),
      mount: (id: string) => {
        const mountTimer = bootstrapLogger.timer('mount')
        const vm = app.mount(id)
        mountTimer.end()
        bootstrapLogger.info({
          title: 'AppMounted',
          msg: `App mounted to element with id ${id}`,
        })

        return vm
      },
    }
  }
  catch (error) {
    console.error('[Error] Failed to create app config:', error)
    throw error
  }
}
