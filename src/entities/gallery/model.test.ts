import type { Cache, LRUCacheManager, NamespaceOptions } from '@tf-app/shared/libs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createGalleryEntity } from './model'

vi.mock('@tf-app/shared/api', () => ({
  isAbortError: (e: any) => !!e?.__abort || e?.name === 'AbortError',
  isHttpError: (e: any) => !!e?.__http || typeof e?.status === 'number',
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

interface Gateway {
  random: ReturnType<typeof vi.fn>
  search: ReturnType<typeof vi.fn>
}

function makeItem(id: string, extra: Record<string, any> = {}): any /* GalleryItem */ {
  return { id, ...extra }
}

describe('gallery entity', () => {
  let lru: ReturnType<typeof createMockCacheManager>
  let gateway: Gateway

  beforeEach(() => {
    lru = createMockCacheManager()
    gateway = {
      random: vi.fn(),
      search: vi.fn(),
    }
  })

  it('should load random items, cache them and update state', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    const items = [makeItem('r1'), makeItem('r2'), makeItem('r3')]
    gateway.random.mockResolvedValueOnce(items)

    const result = await entity.ensureRandom(3)
    expect(result).toEqual(items)
    expect(entity.random.value).toEqual(items)
    expect(entity.randomLoading.value).toBe(false)
    expect(entity.randomError.value).toBeNull()
    expect(gateway.random).toHaveBeenCalledTimes(1)
    expect(gateway.random).toHaveBeenCalledWith(3, undefined)
  })

  it('should return cached random items without calling gateway again', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    const items = [makeItem('r1'), makeItem('r2'), makeItem('r3')]
    gateway.random.mockResolvedValueOnce(items)

    await entity.ensureRandom(3)
    await entity.ensureRandom(3)
    expect(gateway.random).toHaveBeenCalledTimes(1)
    expect(entity.random.value).toEqual(items)
  })

  it('should deduplicate concurrent ensureRandom calls', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    const d = Promise.withResolvers<any[]>()
    gateway.random.mockReturnValueOnce(d.promise)

    const a = entity.ensureRandom(5)
    const b = entity.ensureRandom(5)
    expect(gateway.random).toHaveBeenCalledTimes(1)

    d.resolve([makeItem('x')])
    const [ra, rb] = await Promise.all([a, b])
    expect(ra).toEqual([{ id: 'x' }])
    expect(rb).toEqual([{ id: 'x' }])
    expect(entity.random.value).toEqual([{ id: 'x' }])
  })

  it('should reloadRandom: invalidate cache and refetch', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.random.mockResolvedValueOnce([makeItem('a')])
    await entity.ensureRandom(2)

    gateway.random.mockResolvedValueOnce([makeItem('b')])
    const res = await entity.reloadRandom(2)
    expect(res).toEqual([{ id: 'b' }])
    expect(gateway.random).toHaveBeenCalledTimes(2)
  })

  it('should handle AbortError in random without setting error', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.random.mockRejectedValueOnce({ __abort: true })

    await entity.ensureRandom(3)
    expect(entity.randomError.value).toBeNull()
    expect(entity.random.value).toEqual([])
    expect(entity.randomLoading.value).toBe(false)
  })

  it.each([
    [401, 'Invalid access token'],
    [403, 'Forbidden (check permissions/rate limit)'],
    [404, 'Not found'],
    [400, 'Bad request'],
    [500, 'Server error, try later'],
    [503, 'Server error, try later'],
  ])('should map HTTP %s to message in random: "%s"', async (status, msg) => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.random.mockRejectedValueOnce({ __http: true, status })

    await entity.ensureRandom(3)
    expect(entity.randomError.value).toBe(msg)
    expect(entity.randomLoading.value).toBe(false)
  })

  it('should set rate-limit message in random when remaining=0', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.random.mockRejectedValueOnce({ __http: true, status: 429, rateLimit: { remaining: 0 } })

    await entity.ensureRandom(4)
    expect(entity.randomError.value).toBe('Rate limit exceeded, please try again later')
  })

  it('should join per-field errors for random', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.random.mockRejectedValueOnce({ __http: true, status: 422, errors: ['a', 'b'] })

    await entity.ensureRandom(4)
    expect(entity.randomError.value).toBe('a, b')
  })

  it('should handle unknown errors for random', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.random.mockRejectedValueOnce({ message: 'boom' })
    await entity.ensureRandom(3)
    expect(entity.randomError.value).toBe('boom')

    gateway.random.mockRejectedValueOnce(123 as any)
    await entity.ensureRandom(3)
    expect(entity.randomError.value).toBe('Unknown error')
  })

  it('should return empty array for empty query and not call gateway', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    const res = await entity.search({ query: '   ', page: 1, perPage: 9 })
    expect(res).toEqual([])
    expect(gateway.search).not.toHaveBeenCalled()
  })

  it('should load search items, cache them and store totalPages', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.search.mockResolvedValueOnce({ items: [makeItem('s1')], totalPages: 7 })

    const res = await entity.search({ query: 'cats', page: 2, perPage: 9 })
    expect(res).toEqual([{ id: 's1' }])

    const st = entity.getSearchState('cats', 2)
    expect(st.items).toEqual([{ id: 's1' }])
    expect(st.loading).toBe(false)
    expect(st.error).toBeNull()

    expect(entity.getTotalPages('cats')).toBe(7)
    expect(gateway.search).toHaveBeenCalledWith({ query: 'cats', page: 2, perPage: 9 }, undefined)
  })

  it('should return from cache on subsequent search calls with same query and page', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.search.mockResolvedValueOnce({ items: [makeItem('c1')], totalPages: 3 })

    await entity.search({ query: 'dog', page: 1, perPage: 9 })
    await entity.search({ query: 'dog', page: 1, perPage: 9 })
    expect(gateway.search).toHaveBeenCalledTimes(1)

    const st = entity.getSearchState('dog', 1)
    expect(st.items).toEqual([{ id: 'c1' }])
  })

  it('should deduplicate concurrent search calls for same query and page', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    const d = Promise.withResolvers<{ items: any[], totalPages: number }>()
    gateway.search.mockReturnValueOnce(d.promise)

    const a = entity.search({ query: 'moon', page: 3, perPage: 12 })
    const b = entity.search({ query: 'moon', page: 3, perPage: 12 })
    expect(gateway.search).toHaveBeenCalledTimes(1)

    d.resolve({ items: [makeItem('m1')], totalPages: 5 })
    const [ra, rb] = await Promise.all([a, b])
    expect(ra).toEqual([{ id: 'm1' }])
    expect(rb).toEqual([{ id: 'm1' }])
    expect(entity.getTotalPages('moon')).toBe(5)
  })

  it('should handle AbortError in search without setting error', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.search.mockRejectedValueOnce({ __abort: true })

    const res = await entity.search({ query: 'sun', page: 1, perPage: 9 })
    expect(res).toEqual([])
    const st = entity.getSearchState('sun', 1)
    expect(st.error).toBeNull()
    expect(st.loading).toBe(false)
    expect(st.items).toEqual([])
  })

  it.each([
    [401, 'Invalid access token'],
    [403, 'Forbidden (check permissions/rate limit)'],
    [404, 'Not found'],
    [400, 'Bad request'],
    [500, 'Server error, try later'],
    [503, 'Server error, try later'],
  ])('should map HTTP %s to message in search: "%s"', async (status, msg) => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.search.mockRejectedValueOnce({ __http: true, status })

    const res = await entity.search({ query: 'err', page: 1, perPage: 9 })
    expect(res).toEqual([])

    const st = entity.getSearchState('err', 1)
    expect(st.error).toBe(msg)
    expect(st.loading).toBe(false)
    expect(st.items).toEqual([])
  })

  it('should set rate-limit message in search when remaining=0', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.search.mockRejectedValueOnce({ __http: true, status: 429, rateLimit: { remaining: 0 } })

    await entity.search({ query: 'rl', page: 1, perPage: 9 })
    expect(entity.getSearchState('rl', 1).error).toBe('Rate limit exceeded, please try again later')
  })

  it('should join per-field errors for search', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.search.mockRejectedValueOnce({ __http: true, status: 422, errors: ['a', 'b'] })

    await entity.search({ query: 'pf', page: 1, perPage: 9 })
    expect(entity.getSearchState('pf', 1).error).toBe('a, b')
  })

  it('should handle unknown errors for search', async () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    gateway.search.mockRejectedValueOnce({ message: 'boom' })
    await entity.search({ query: 'u', page: 1, perPage: 9 })
    expect(entity.getSearchState('u', 1).error).toBe('boom')

    gateway.search.mockRejectedValueOnce(123 as any)
    await entity.search({ query: 'u', page: 2, perPage: 9 })
    expect(entity.getSearchState('u', 2).error).toBe('Unknown error')
  })

  it('should return 0 total pages when not cached', () => {
    const entity = createGalleryEntity({ gateway: gateway as any, lru })
    expect(entity.getTotalPages('nope')).toBe(0)
  })
})
