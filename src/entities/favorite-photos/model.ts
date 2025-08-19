import type { Ref } from 'vue'
// TODO: make local type
import type { GalleryItem } from '../gallery'
import { token } from '@tf-app/shared/di/container'
import { computed, ref } from 'vue'

export interface FavoritesRepo {
  items: Ref<GalleryItem[]>
  has: (id: string) => boolean
  add: (item: GalleryItem) => void
  remove: (id: string) => void
  clear: () => void
}

export const FAVORITES_REPO = token<FavoritesRepo>('FavoritesRepo')

const KEY = 'favorites:v1'
function load(): GalleryItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as GalleryItem[]
  }
  catch {
    return []
  }
}
function save(items: Ref<GalleryItem[]>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.value))
  }
  catch {}
}

export function createFavoritesRepoLS(): FavoritesRepo {
  const items = ref<GalleryItem[]>(load())

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === KEY && e.storageArea === localStorage && e.newValue) {
        try {
          items.value = JSON.parse(e.newValue) as GalleryItem[]
        }
        catch {}
      }
    })
  }

  const has = (id: string) => items.value.some(x => x.id === id)
  const add = (item: GalleryItem) => {
    if (!has(item.id)) {
      items.value = [...items.value, item]
      save(items)
    }
  }
  const remove = (id: string) => {
    if (has(id)) {
      items.value = items.value.filter(x => x.id !== id)
      save(items)
    }
  }
  const clear = () => {
    items.value = []
    save(items)
  }

  return { items, has, add, remove, clear }
}

export function createFavoritesEntity(deps: { repo: FavoritesRepo }) {
  const { repo } = deps
  const total = computed(() => repo.items.value.length)
  const toggle = (item: GalleryItem) => repo.has(item.id) ? repo.remove(item.id) : repo.add(item)

  return { items: repo.items, total, has: repo.has, add: repo.add, remove: repo.remove, clear: repo.clear, toggle }
}
