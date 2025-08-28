import type { FavoritesRepo } from '@tf-app/entities/favorite-photos'
import type { GalleryItem } from '@tf-app/entities/gallery'
import type { Notifier } from '@tf-app/shared/di/tokens'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createToggleFavorite } from './model'

const makeItem = (id = 'x', extra: Record<string, any> = {}): GalleryItem => ({ id, ...extra }) as GalleryItem

function makeRepo(hasInitially = false): FavoritesRepo {
  const set = new Set<string>(hasInitially ? ['x'] : [])
  return {
    items: { value: [] } as any,
    has: vi.fn((id: string) => set.has(id)),
    add: vi.fn((item: any) => void set.add(item.id)),
    remove: vi.fn((id: string) => void set.delete(id)),
    clear: vi.fn(() => void set.clear()),
  }
}

function makeNotifier(): Notifier {
  return {
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  } as any
}

describe('createToggleFavorite', () => {
  let repo: FavoritesRepo
  let notify: Notifier

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
    expect(notify.success).toHaveBeenCalledWith('Photo added to favorites')
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
    expect(notify.info).toHaveBeenCalledWith('Photo removed from favorites')
    expect(notify.success).not.toHaveBeenCalled()
    expect(res).toBe(false)
  })
})
