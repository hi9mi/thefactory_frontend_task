import type { PhotoListItem } from './types'
import { useLocalStorage } from '@vueuse/core'
import { token } from 'ditox'
import { defineStore } from 'pinia'
import { computed } from 'vue'

const KEY = 'favorites:v1'

type FavoritePhotosStore = ReturnType<ReturnType<typeof createFavoritePhotosStore>>

export const FAVORITE_PHOTO_STORE_TOKEN = token<FavoritePhotosStore>('favorite-photos-store')

export function createFavoritePhotosStore(key: string) {
  return defineStore(key, () => {
    const items = useLocalStorage<PhotoListItem[]>(KEY, [], {
      listenToStorageChanges: true,
    })
    const itemsIds = computed(() => items.value.map(item => item.id))

    const has = (id: string) => itemsIds.value.includes(id)

    const add = (item: PhotoListItem) => {
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

    const toggle = (item: PhotoListItem) => {
      return has(item.id) ? remove(item.id) : add(item)
    }

    return { items, has, add, remove, clear, toggle }
  })
}
