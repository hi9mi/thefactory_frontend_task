import type { App } from 'vue'
import { createPinia } from 'pinia'
import { PiniaLogger } from 'pinia-logger'

export function initPinia(app: App) {
  const pinia = createPinia()
  const { PROD } = import.meta.env

  pinia.use(
    PiniaLogger({
      disabled: PROD,
    }),
  )
  app.use(pinia)
}
