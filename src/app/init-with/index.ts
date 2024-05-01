import { withNProgress } from './with-nprogress'
import { withPinia } from './with-pinia'
import { withRouter } from './with-router'

export const initWith = {
  router: withRouter,
  pinia: withPinia,
  nprogress: withNProgress,
}
