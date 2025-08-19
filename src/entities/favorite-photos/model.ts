import type { Photo } from '@tf-app/shared/api'
import type { Ref } from 'vue'
import { token } from '@tf-app/shared/di/container'
import { computed, ref } from 'vue'

export interface FavoritesRepo {
  items: Ref<Photo[]>
  has: (id: string) => boolean
  add: (item: Photo) => void
  remove: (id: string) => void
  clear: () => void
}

export const FAVORITES_REPO = token<FavoritesRepo>('FavoritesRepo')

const KEY = 'favorites:v1'
function load(): Photo[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Photo[]
  }
  catch {
    return []
  }
}
function save(items: Ref<Photo[]>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.value))
  }
  catch {}
}

export function createFavoritesRepoLS(): FavoritesRepo {
  const items = ref<Photo[]>(load())

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === KEY && e.storageArea === localStorage && e.newValue) {
        try {
          items.value = JSON.parse(e.newValue) as Photo[]
        }
        catch {}
      }
    })
  }

  const has = (id: string) => items.value.some(x => x.id === id)
  const add = (item: Photo) => {
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
  const toggle = (item: Photo) => repo.has(item.id) ? repo.remove(item.id) : repo.add(item)

  return { items: repo.items, total, has: repo.has, add: repo.add, remove: repo.remove, clear: repo.clear, toggle }
}
