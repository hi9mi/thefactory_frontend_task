import type { Cache, LRUCacheManager, NamespaceOptions } from '@tf-app/shared/libs/cache/manager'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPhotoDetailsEntity } from './model'

vi.mock('@tf-app/shared/api', () => ({
  isAbortError: (err: any) => !!err?.__abort || err?.name === 'AbortError',
  isHttpError: (err: any) => !!err?.__http || typeof err?.status === 'number',
}))

export function createMockCacheManager(): LRUCacheManager {
  const namespaces = new Map<string, Map<string, any>>()

  return {
    scope<K, V>(namespace: string, opts: NamespaceOptions<K>): Cache<K, V> {
      let store = namespaces.get(namespace)
      if (!store) {
        store = new Map()
        namespaces.set(namespace, store)
      }
      const { serializeKey } = opts
      return {
        get(key) {
          return store!.get(serializeKey(key))
        },
        set(key, value) {
          store.set(serializeKey(key), value)
        },
        delete(key) {
          return store.delete(serializeKey(key))
        },
        has(key) {
          return store.has(serializeKey(key))
        },
        clear() {
          store.clear()
        },
      }
    },
    clearAll() {
      namespaces.clear()
    },
  }
}

describe('details-photo entity', () => {
  let lru: ReturnType<typeof createMockCacheManager>
  let gateway: { getById: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    lru = createMockCacheManager()
    gateway = { getById: vi.fn() }
  })

  it('should create empty state entry on getState() without ensure()', () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    const s = entity.getState('x')
    expect(s.item).toBeNull()
    expect(s.loading).toBe(false)
    expect(s.error).toBeNull()
  })

  it('should load item, cache it and update state', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockResolvedValueOnce({ id: 'p1' })

    const result = await entity.ensure('p1')
    expect(result).toEqual({ id: 'p1' })
    expect(entity.getState('p1').item).toEqual({ id: 'p1' })
    expect(gateway.getById).toHaveBeenCalledTimes(1)
  })

  it('should deduplicate concurrent requests for the same id', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })

    const d = Promise.withResolvers<any>()
    gateway.getById.mockReturnValueOnce(d.promise)

    const a = entity.ensure('p2')
    const b = entity.ensure('p2')
    expect(gateway.getById).toHaveBeenCalledTimes(1)

    d.resolve({ id: 'p2' })
    await Promise.all([a, b])

    expect(entity.getState('p2').item).toEqual({ id: 'p2' })
  })

  it('should return from cache on subsequent ensure() calls', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockResolvedValueOnce({ id: 'p3' })

    await entity.ensure('p3')
    expect(gateway.getById).toHaveBeenCalledTimes(1)

    await entity.ensure('p3')
    expect(gateway.getById).toHaveBeenCalledTimes(1)
  })

  it('should reload item by invalidating cache', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockResolvedValueOnce({ id: 'p4', v: 1 })
    await entity.ensure('p4')

    gateway.getById.mockResolvedValueOnce({ id: 'p4', v: 2 })
    const result = await entity.reload('p4')
    expect(result).toEqual({ id: 'p4', v: 2 })
  })

  it('should handle AbortError without setting error or item', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockRejectedValueOnce({ __abort: true })
    await entity.ensure('p5')

    const s = entity.getState('p5')
    expect(s.error).toBeNull()
    expect(s.item).toBeNull()
    expect(s.loading).toBe(false)
  })

  it.each([
    [401, 'Invalid access token'],
    [403, 'Forbidden (check permissions/rate limit)'],
    [404, 'Not found'],
    [400, 'Bad request'],
    [500, 'Server error, try later'],
    [503, 'Server error, try later'],
  ])('should map HTTP %s to message "%s"', async (status, msg) => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockRejectedValueOnce({ __http: true, status })

    await entity.ensure('p-http')
    expect(entity.getState('p-http').error).toBe(msg)
  })

  it('should set rate-limit exceeded message when remaining=0', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockRejectedValueOnce({ __http: true, status: 429, rateLimit: { remaining: 0 } })

    await entity.ensure('p429')
    expect(entity.getState('p429').error).toBe('Rate limit exceeded, please try again later')
  })

  it('should join error messages array into single string', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockRejectedValueOnce({ __http: true, status: 422, errors: ['a', 'b'] })

    await entity.ensure('per-field')
    expect(entity.getState('per-field').error).toBe('a, b')
  })

  it('should handle unknown errors by using message or "Unknown error"', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockRejectedValueOnce({ message: 'boom' })
    await entity.ensure('u1')
    expect(entity.getState('u1').error).toBe('boom')

    gateway.getById.mockRejectedValueOnce(123 as any)
    await entity.ensure('u2')
    expect(entity.getState('u2').error).toBe('Unknown error')
  })

  it('should clear state and cache on clear()', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    gateway.getById.mockResolvedValueOnce({ id: 'p6' })
    await entity.ensure('p6')
    expect(entity.getState('p6').item).toEqual({ id: 'p6' })

    entity.clear()
    const s = entity.getState('p6')
    expect(s.item).toBeNull()
    expect(s.error).toBeNull()
    expect(s.loading).toBe(false)
  })

  it('should reuse the same object reference from cache', async () => {
    const entity = createPhotoDetailsEntity({ gateway, lru })
    const obj = { id: 'p7' }
    gateway.getById.mockResolvedValueOnce(obj)

    const first = await entity.ensure('p7')
    const second = await entity.ensure('p7')
    expect(first).toStrictEqual(second)
  })
})
