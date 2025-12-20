import type { AppConfig } from '@tf-app/shared/config'
import type { Logger } from '@tf-app/shared/libs'
import type { Router } from 'vue-router'
import { nprogressGuard, nprogressGuardCleanup } from './nprogress.guard'

export interface GuardsOptions {
  config: AppConfig
  logger: Logger
}

export function setupGuards(router: Router, options: GuardsOptions) {
  const { config, logger } = options

  router.beforeEach(nprogressGuard)

  if (config.dev) {
    router.beforeEach((to, from) => {
      logger.child('Router').info({
        title: 'Navigating',
        msg: `Navigating from ${from.path} to ${to.path}`,
        data: { from, to },
      })
    })
  }

  router.afterEach(nprogressGuardCleanup)
}
