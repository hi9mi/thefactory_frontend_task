import type { AppStorage } from '@tf-app/shared/libs'
import type { Ref } from 'vue'
// TODO: make local type
import type { GalleryItem } from '../gallery'
import { token } from 'ditox'
import { computed, ref, unref } from 'vue'

export interface FavoritesRepo {
  items: Ref<GalleryItem[]>
  has: (id: string) => boolean
  add: (item: GalleryItem) => void
  remove: (id: string) => void
  clear: () => void
}

export const FAVORITES_REPO = token<FavoritesRepo>()

const KEY = 'favorites:v1'

export function createFavoritesRepo(storage: AppStorage): FavoritesRepo {
  const items = ref<GalleryItem[]>(storage.get(KEY) ?? [])

  const isLocalStorage = (kind: AppStorage['kind']): kind is 'localStorage' => kind === 'localStorage'
  const kind = storage.kind

  if (isLocalStorage(kind) && typeof globalThis.window !== 'undefined') {
    globalThis.addEventListener('storage', (event) => {
      if (event.key === KEY && event.storageArea === globalThis[kind] && event.newValue) {
        try {
          items.value = JSON.parse(event.newValue) as GalleryItem[]
        }
        catch (error) {
          console.error('[Repo Error] parsing favorites', error)
        }
      }
    })
  }

  const has = (id: string) => items.value.some(item => item.id === id)

  const add = (item: GalleryItem) => {
    if (!has(item.id)) {
      items.value = [...items.value, item]
      storage.set(KEY, unref(items))
    }
  }

  const remove = (id: string) => {
    if (has(id)) {
      items.value = items.value.filter(item => item.id !== id)
      storage.set(KEY, unref(items))
    }
  }

  const clear = () => {
    items.value = []
    storage.set(KEY, unref(items))
  }

  return { items, has, add, remove, clear }
}

export function createFavoritesEntity(deps: { repo: FavoritesRepo }) {
  const { repo } = deps
  const total = computed(() => repo.items.value.length)
  const toggle = (item: GalleryItem) => repo.has(item.id) ? repo.remove(item.id) : repo.add(item)

  return { items: repo.items, total, has: repo.has, add: repo.add, remove: repo.remove, clear: repo.clear, toggle }
}
