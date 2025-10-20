import type { AppStorage } from './app-storage'

export function createSessionStorage(): AppStorage {
  return {
    kind: 'sessionStorage',
    get: (key: string) => {
      const value = globalThis.sessionStorage.getItem(key)
      return value ? JSON.parse(value) : null
    },
    set: (key: string, value: unknown) => {
      globalThis.sessionStorage.setItem(key, JSON.stringify(value))
    },
  }
}
