import type { AppConfig } from '@tf-app/shared/config'
import { token } from 'ditox'
import { createLocalStorage } from './create-local-storage'
import { createMemoryStorage } from './create-memory-storage'
import { createSessionStorage } from './create-session-storage'

export type StorageKind = 'localStorage' | 'sessionStorage' | (string & {})

export interface AppStorage {
  get: <V>(key: string) => V | null
  set: <V>(key: string, value: V) => void
  kind: StorageKind
}

// TODO: implement cookieStorage
export function createAppStorage(config: AppConfig) {
  const storageBuilder = {
    localStorage: createLocalStorage,
    sessionStorage: createSessionStorage,
    memoryStorage: createMemoryStorage,
  }

  return storageBuilder[config.storageKind]()
}

export const APP_STORAGE_TOKEN = token<AppStorage>()
