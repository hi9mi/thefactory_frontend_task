// TODO: make local type
import type { GalleryItem } from '../gallery'
import { useLocalStorage } from '@vueuse/core'
import { token } from 'ditox'
import { defineStore } from 'pinia'
import { computed } from 'vue'

const KEY = 'favorites:v1'

export type FavoritesStore = ReturnType<ReturnType<typeof createFavoritesStore>>

export const FAVORITES_STORE_TOKEN = token<FavoritesStore>('favorites-store')

export function createFavoritesStore(key: string) {
  return defineStore(key, () => {
    const items = useLocalStorage<GalleryItem[]>(KEY, [], {
      listenToStorageChanges: true,
    })
    const itemsIds = computed(() => items.value.map(item => item.id))

    const has = (id: string) => itemsIds.value.includes(id)

    const add = (item: GalleryItem) => {
      if (!has(item.id)) {
        items.value.push(item)
        return 'added' as const
      }
      return 'already-exists' as const
    }

    const remove = (id: string) => {
      if (has(id)) {
        const index = items.value.findIndex(x => x.id === id)
        items.value.splice(index, 1)
        return 'removed' as const
      }
      return 'not-found' as const
    }

    const clear = () => {
      items.value = []
      return 'cleared' as const
    }

    const toggle = (item: GalleryItem) => {
      return has(item.id) ? remove(item.id) : add(item)
    }

    return { items, has, add, remove, clear, toggle }
  })
}
