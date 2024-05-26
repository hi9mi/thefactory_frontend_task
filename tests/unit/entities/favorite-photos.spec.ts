import { ref } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useFavoritePhotosStore } from '@tf-app/entities/favorite-photos'
import { usePersistLS } from '@tf-app/shared/libs'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'

import { mockPhoto } from '../mocks/photo'

vi.mock('@tf-app/shared/ui/feedback/tf-notification/libs', () => ({
  notify: vi.fn(),
}))
vi.mock('@vueuse/router', () => ({
  useRouteQuery: vi.fn(),
}))
vi.mock('@tf-app/shared/libs')
describe('favorite-photos entity', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // @ts-expect-error mock
    useRouteQuery.mockReturnValue(ref(1))
    vi.mocked(usePersistLS).mockReturnValue(ref([]))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should add photo to favorites', () => {
    const favoritePhotosStore = useFavoritePhotosStore()
    favoritePhotosStore.toggleFavoritePhoto(mockPhoto)

    expect(favoritePhotosStore.favoritePhotos).toEqual([mockPhoto])
    expect(vi.mocked(notify)).toHaveBeenCalledWith({ title: 'Успех!', message: 'Фото добавлено в избранное', type: 'success' })
  })

  it('should remove photo from favorites', () => {
    const favoritePhotosStore = useFavoritePhotosStore()
    favoritePhotosStore.toggleFavoritePhoto(mockPhoto)
    favoritePhotosStore.toggleFavoritePhoto(mockPhoto)

    expect(favoritePhotosStore.favoritePhotos).toEqual([])
    expect(vi.mocked(notify)).toHaveBeenCalledWith({ title: 'Успех!', message: 'Фото удалено из избранного', type: 'success' })
  })

  it('should reflect the currentPage from the query', () => {
    // @ts-expect-error mock
    useRouteQuery.mockReturnValue(ref(2))
    const favoritePhotosStore = useFavoritePhotosStore()

    expect(favoritePhotosStore.currentPage).toEqual(2)
  })
})
