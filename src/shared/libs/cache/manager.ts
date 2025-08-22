import type { LRU } from './lru'
import { createLRU } from './lru'

export interface NamespaceOptions<K> {
  max: number
  ttl?: number
  serializeKey: (k: K) => string
}

export interface Cache<K, V> {
  get: (key: K) => V | undefined
  set: (key: K, value: V) => void
  delete: (key: K) => boolean
  has: (key: K) => boolean
  clear: () => void
}

export interface LRUCacheManager {
  scope: <K, V>(namespace: string, opts: NamespaceOptions<K>) => Cache<K, V>
  clearAll: () => void
}

export function createLRUCacheManager(): LRUCacheManager {
  const namespaces = new Map<string, LRU<string, string>>()

  function ensureNs(ns: string, max: number, ttl?: number) {
    let lru = namespaces.get(ns)
    if (!lru) {
      lru = createLRU<string, string>({ max, ttl })
      namespaces.set(ns, lru)
    }
    return lru
  }

  return {
    scope<K, V>(namespace: string, opts: NamespaceOptions<K>): Cache<K, V> {
      const { max, ttl, serializeKey } = opts
      const lru = ensureNs(namespace, max, ttl)

      return {
        get(key) {
          const raw = lru.get(serializeKey(key))
          if (raw === undefined)
            return undefined
          try {
            return JSON.parse(raw) as V
          }
          catch {
            lru.delete(serializeKey(key))
            return undefined
          }
        },
        set(key, value) {
          lru.set(serializeKey(key), JSON.stringify(value))
        },
        delete(key) {
          return lru.delete(serializeKey(key))
        },
        has(key) {
          return lru.has(serializeKey(key))
        },
        clear() {
          lru.clear()
        },
      }
    },

    clearAll() {
      namespaces.clear()
    },
  }
}
