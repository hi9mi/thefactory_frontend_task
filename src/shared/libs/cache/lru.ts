export interface LruOptions<K> {
  max: number
  ttl?: number
  now?: () => number
  onEvict?: (key: K, reason: 'max' | 'ttl') => void
}

interface Entry<V> { value: V, expiresAt?: number }

export interface LRU<K, V> {
  get: (key: K) => V | undefined
  peek: (key: K) => V | undefined
  set: (key: K, value: V) => void
  has: (key: K) => boolean
  delete: (key: K) => boolean
  clear: () => void
  readonly size: number
}

export function createLRU<K, V>(opts: LruOptions<K>): LRU<K, V> {
  const max = Math.max(1, opts.max)
  const ttl = opts.ttl
  const now = opts.now ?? Date.now
  const onEvict = opts.onEvict
  const map = new Map<K, Entry<V>>()

  const expired = (e: Entry<V>) => e.expiresAt !== undefined && e.expiresAt <= now()

  function evictIfExpired(key: K, entry: Entry<V>): boolean {
    if (!expired(entry))
      return false
    map.delete(key)
    onEvict?.(key, 'ttl')
    return true
  }

  return {
    get(key) {
      const entry = map.get(key)
      if (!entry)
        return
      if (evictIfExpired(key, entry))
        return
      map.delete(key)
      map.set(key, entry)
      return entry.value
    },
    peek(key) {
      const entry = map.get(key)
      if (!entry)
        return
      if (evictIfExpired(key, entry))
        return
      return entry.value
    },
    set(key, value) {
      const entry: Entry<V> = { value, expiresAt: ttl ? now() + ttl : undefined }
      if (map.has(key))
        map.delete(key)
      map.set(key, entry)
      while (map.size > max) {
        const oldest = map.keys().next().value as K
        map.delete(oldest)
        onEvict?.(oldest, 'max')
      }
    },
    has(key) {
      return this.get(key) !== undefined
    },
    delete(key) {
      return map.delete(key)
    },
    clear() {
      map.clear()
    },
    get size() {
      return map.size
    },
  }
}
