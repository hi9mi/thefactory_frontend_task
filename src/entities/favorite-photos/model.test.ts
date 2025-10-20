import { createAppStorage } from '@tf-app/shared/libs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFavoritesEntity, createFavoritesRepo } from './model'

const KEY = 'favorites:v1'

function makeItem(id: string, extra: Record<string, any> = {}): any /* GalleryItem */ {
  return { id, ...extra }
}

describe('createFavoritesRepoLS', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('should load initial items from localStorage when JSON is valid', () => {
    const initial = [makeItem('a'), makeItem('b')]
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    storage.set(KEY, initial)
    const repo = createFavoritesRepo(storage)
    expect(repo.items.value).toEqual(initial)
  })

  it('should add a unique item and persist via localStorage', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    const item = makeItem('x')

    repo.add(item)
    expect(repo.items.value).toEqual([item])
    expect(spy).toHaveBeenCalledTimes(1)
    const [key, payload] = spy.mock.calls.at(-1)!
    expect(key).toBe(KEY)
    expect(JSON.parse(payload)).toEqual([item])
  })

  it('should not add duplicate items by id', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    const item = makeItem('x')

    repo.add(item)
    repo.add(item)
    expect(repo.items.value).toHaveLength(1)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should remove an existing item and persist', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    const a = makeItem('a')
    const b = makeItem('b')
    repo.add(a)
    repo.add(b)
    spy.mockClear()

    repo.remove('a')
    expect(repo.items.value).toEqual([b])
    expect(spy).toHaveBeenCalledTimes(1)
    const [key, payload] = spy.mock.calls.at(-1)!
    expect(key).toBe(KEY)
    expect(JSON.parse(payload)).toEqual([b])
  })

  it('should not persist when removing a non-existing item', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    repo.remove('nope')
    expect(spy).not.toHaveBeenCalled()
    expect(repo.items.value).toEqual([])
  })

  it('should clear items and persist empty list', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    repo.add(makeItem('x'))
    spy.mockClear()

    repo.clear()
    expect(repo.items.value).toEqual([])
    expect(spy).toHaveBeenCalledTimes(1)
    const [key, payload] = spy.mock.calls.at(-1)!
    expect(key).toBe(KEY)
    expect(JSON.parse(payload)).toEqual([])
  })

  it('should react to storage event and update items from newValue', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)

    const updated = [makeItem('u1'), makeItem('u2')]
    storage.set(KEY, updated)

    const event = new StorageEvent('storage', {
      key: KEY,
      storageArea: localStorage,
      newValue: localStorage.getItem(KEY),
    })
    globalThis.dispatchEvent(event)
    expect(repo.items.value).toEqual(updated)
  })

  it('should ignore storage event with invalid JSON newValue', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    repo.add(makeItem('a'))

    const event = new StorageEvent('storage', {
      key: KEY,
      storageArea: localStorage,
      newValue: '{bad json',
    })
    expect(() => globalThis.dispatchEvent(event)).not.toThrow()
    expect(repo.items.value).toEqual([makeItem('a')])
  })
})

describe('createFavoritesEntity', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('should expose items and computed total', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    const entity = createFavoritesEntity({ repo })

    expect(entity.total.value).toBe(0)
    repo.add(makeItem('a'))
    expect(entity.total.value).toBe(1)
  })

  it('should proxy has/add/remove/clear', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    const entity = createFavoritesEntity({ repo })
    const a = makeItem('a')
    const b = makeItem('b')

    expect(entity.has('a')).toBe(false)
    entity.add(a)
    expect(entity.has('a')).toBe(true)
    entity.add(b)
    expect(entity.items.value.map(x => x.id)).toEqual(['a', 'b'])

    entity.remove('a')
    expect(entity.items.value.map(x => x.id)).toEqual(['b'])

    entity.clear()
    expect(entity.items.value).toEqual([])
  })

  it('should toggle: add when missing, remove when exists', () => {
    const storage = createAppStorage({
      storageKind: 'localStorage',
    } as any)
    const repo = createFavoritesRepo(storage)
    const entity = createFavoritesEntity({ repo })
    const x = makeItem('x')

    entity.toggle(x)
    expect(entity.has('x')).toBe(true)

    entity.toggle(x)
    expect(entity.has('x')).toBe(false)
  })
})
