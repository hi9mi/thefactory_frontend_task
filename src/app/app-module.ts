import type { AppConfig } from '@tf-app/shared/config'
import type { Container } from 'ditox'
import { APP_CONFIG_TOKEN } from '@tf-app/shared/config'
import { apiProvider } from './providers/api.provider'
import { storageProvider } from './providers/storage.provider'
import { storeProvider } from './providers/store.provider'
import { uiProvider } from './providers/ui.provider'

export function appModule(container: Container, params: {
  config: AppConfig
}) {
  container.bindValue(APP_CONFIG_TOKEN, params.config)

  uiProvider(container)
  apiProvider(container)
  storageProvider(container)
  storeProvider(container)
}
