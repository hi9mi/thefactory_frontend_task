import type { AppConfig } from '@tf-app/shared/config'
import type { Router } from 'vue-router'
import { nprogressGuard, nprogressGuardCleanup } from './nprogress.guard'

export interface GuardsOptions {
  config: AppConfig
}

export function setupGuards(router: Router, options: GuardsOptions) {
  const { config } = options

  router.beforeEach(nprogressGuard)

  if (config.dev) {
    router.beforeEach((to, from) => {
      // eslint-disable-next-line no-console
      console.log(`[Router] ${from.path} → ${to.path}`)
    })
  }

  router.afterEach(nprogressGuardCleanup)
}
