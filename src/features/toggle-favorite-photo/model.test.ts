import type { FavoritesRepo } from '@tf-app/entities/favorite-photos'
import type { GalleryItem } from '@tf-app/entities/gallery'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createToggleFavorite } from './model'

const makeItem = (id = 'x', extra: Record<string, any> = {}): GalleryItem => ({ id, ...extra }) as GalleryItem

vi.mock(import('@tf-app/shared/libs'), async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tf-app/shared/libs')>()
  return {
    ...actual,
    useDependency: vi.fn(),
  }
})

function makeRepo(hasInitially = false): FavoritesRepo {
  const set = new Set<string>(hasInitially ? ['x'] : [])
  return {
    items: { value: [] } as any,
    has: vi.fn((id: string) => set.has(id)),
    add: vi.fn((item: any) => set.add(item.id)),
    remove: vi.fn((id: string) => set.delete(id)),
    clear: vi.fn(() => set.clear()),
  }
}

function makeNotifier() {
  return {
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  } as any
}

describe('createToggleFavorite', () => {
  let repo: FavoritesRepo
  let notify: any

  beforeEach(() => {
    repo = makeRepo(false)
    notify = makeNotifier()
    vi.restoreAllMocks()
  })

  it('should add when item is not in favorites, call success and return true', () => {
    const { toggle } = createToggleFavorite({ repo, notify })
    const item = makeItem('x')

    const res = toggle(item)

    expect(repo.has).toHaveBeenCalledWith('x')
    expect(repo.add).toHaveBeenCalledWith(item)
    expect(repo.remove).not.toHaveBeenCalled()
    expect(notify.success).toHaveBeenCalledWith('Photo added to favorites', 'Success')
    expect(notify.info).not.toHaveBeenCalled()
    expect(res).toBe(true)
  })

  it('should remove when item is already in favorites, call info and return false', () => {
    repo = makeRepo(true)
    notify = makeNotifier()
    const { toggle } = createToggleFavorite({ repo, notify })
    const item = makeItem('x')

    const res = toggle(item)

    expect(repo.has).toHaveBeenCalledWith('x')
    expect(repo.remove).toHaveBeenCalledWith('x')
    expect(repo.add).not.toHaveBeenCalled()
    expect(notify.info).toHaveBeenCalledWith('Photo removed from favorites', 'Info')
    expect(notify.success).not.toHaveBeenCalled()
    expect(res).toBe(false)
  })
})
