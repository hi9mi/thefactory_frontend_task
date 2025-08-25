import { describe, expect, it, vi } from 'vitest'
import { createLRUCacheManager } from './manager'

describe('lRUCacheManager', () => {
  it('should evict the oldest entry when capacity is exceeded', () => {
    const manager = createLRUCacheManager()
    const cache = manager.scope<string, number>('t1', { max: 2, serializeKey: v => v })

    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    expect(cache.has('a')).toBe(false)
    expect(cache.get('b')).toBe(2)
    expect(cache.get('c')).toBe(3)
  })

  it('should mark an accessed key as most-recently-used (touch on get)', () => {
    const manager = createLRUCacheManager()
    const cache = manager.scope<string, number>('t2', { max: 2, serializeKey: v => v })

    cache.set('a', 1)
    cache.set('b', 2)

    expect(cache.get('a')).toBe(1)

    cache.set('c', 3)
    expect(cache.has('b')).toBe(false)
    expect(cache.get('a')).toBe(1)
    expect(cache.get('c')).toBe(3)
  })

  it('should expire entries after TTL', () => {
    vi.useFakeTimers()
    const manager = createLRUCacheManager()
    const cache = manager.scope<string, number>('ttl', { max: 10, serializeKey: v => v, ttl: 1000 })

    cache.set('x', 42)
    expect(cache.get('x')).toBe(42)

    vi.advanceTimersByTime(1001)
    expect(cache.has('x')).toBe(false)
    vi.useRealTimers()
  })

  it('should keep scopes isolated (no leakage between scope stores)', () => {
    const manager = createLRUCacheManager()
    const a = manager.scope<string, string>('A', { max: 10, serializeKey: v => v })
    const b = manager.scope<string, string>('B', { max: 10, serializeKey: v => v })

    a.set('k', 'from-A')
    expect(a.get('k')).toBe('from-A')
    expect(b.has('k')).toBe(false)

    b.set('k', 'from-B')
    expect(a.get('k')).toBe('from-A')
    expect(b.get('k')).toBe('from-B')
  })
})
