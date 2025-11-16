import type { Container } from 'ditox'
import { CACHE_TOKEN, createLRUCache } from '@tf-app/shared/libs'

export function storageProvider(container: Container) {
  container.bindFactory(
    CACHE_TOKEN,
    () => createLRUCache({ maxSize: 1000 }),
    { scope: 'singleton' },
  )
}
