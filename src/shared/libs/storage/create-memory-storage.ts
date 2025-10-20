import type { AppStorage } from './app-storage'

export function createMemoryStorage(): AppStorage {
  let store: any = null

  return {
    kind: 'memoryStorage',
    get: (_: string) => {
      return store
    },
    set: (_: string, value: unknown) => {
      store = value
    },
  }
}
