import type { AppStorage } from './app-storage'

export function createLocalStorage(): AppStorage {
  return {
    kind: 'localStorage',
    get: (key: string) => {
      try {
        const value = globalThis.localStorage.getItem(key)
        return value ? JSON.parse(value) : null
      }
      catch {
        return null
      }
    },
    set: (key: string, value: unknown) => {
      globalThis.localStorage.setItem(key, JSON.stringify(value))
    },
  }
}
