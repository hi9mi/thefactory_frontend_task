import { useGalleryStore } from '@tf-app/entities/gallery'
import * as api from '@tf-app/shared/api'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'
import { useRouteQuery } from '@vueuse/router'

import { createPinia, setActivePinia } from 'pinia'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { mockPhoto, mockPhotos } from '../mocks/photo'

vi.mock('@tf-app/shared/ui/feedback/tf-notification/libs', () => ({
  notify: vi.fn(),
}))
vi.mock('@vueuse/router', () => ({
  useRouteQuery: vi.fn(),
}))
vi.mock('@tf-app/shared/api')
vi.stubGlobal('fetch', vi.fn())

describe('gallery entity', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const searchTermRef = ref('init')
    const pageRef = ref(1)

    // @ts-expect-error mock
    useRouteQuery.mockImplementation((queryKey) => {
      if (queryKey === 'q')
        return searchTermRef
      else if (queryKey === 'p')
        return pageRef
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  it('fetches random photos and updates state', async () => {
    vi.mocked(api).getRandomPhotos.mockResolvedValue(mockPhotos)
    const galleryStore = useGalleryStore()

    expect(galleryStore.isLoadingRandomPhotos).toBe(false)

    const fetchRandomPhotosPromise = galleryStore.fetchRandomPhotos()
    expect(galleryStore.isLoadingRandomPhotos).toBe(true)
    expect(galleryStore.randomPhotos).toEqual([])

    await fetchRandomPhotosPromise

    expect(galleryStore.isLoadingRandomPhotos).toBe(false)
    expect(galleryStore.randomPhotos).toEqual(mockPhotos)
  })

  it('updates search term and current page', () => {
    const galleryStore = useGalleryStore()

    expect(galleryStore.page).toBe(1)
    expect(galleryStore.searchTerm).toBe('init')

    galleryStore.changeSearchTerm('example search term')
    galleryStore.changeCurrentPage(2)

    expect(galleryStore.page).toBe(2)
    expect(galleryStore.searchTerm).toBe('example search term')
  })

  it('fetches photos based on search term and page', async () => {
    vi.mocked(api).getSearchPhotos.mockResolvedValue({ results: mockPhotos, total_pages: 1, total: 1 })
    const galleryStore = useGalleryStore()
    galleryStore.changeSearchTerm('example search term')

    const fetchPhotosPromise = galleryStore.fetchPhotos()
    expect(galleryStore.isLoadingPhotos).toBe(true)
    expect(galleryStore.photos).toBeNull()

    await fetchPhotosPromise
    expect(galleryStore.isLoadingPhotos).toBe(false)
    expect(galleryStore.photos).toEqual({ results: mockPhotos, total_pages: 1, total: 1 })
    expect(vi.mocked(api).getSearchPhotos).toHaveBeenCalledWith('example search term', 1)
  })

  it('handles API errors when fetching photos', async () => {
    vi.mocked(api).getSearchPhotos.mockRejectedValue(new Error('API error'))
    const galleryStore = useGalleryStore()

    const fetchPhotosPromise = galleryStore.fetchPhotos()
    expect(galleryStore.isLoadingPhotos).toBe(true)
    expect(galleryStore.photos).toBeNull()

    await fetchPhotosPromise
    expect(galleryStore.isLoadingPhotos).toBe(false)
    expect(galleryStore.photos).toEqual(null)
    expect(vi.mocked(api).getSearchPhotos).toHaveBeenCalledWith('init', 1)
    expect(vi.mocked(notify)).toHaveBeenCalledWith({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
  })

  it('handles API errors when fetching random photos', async () => {
    vi.mocked(api).getRandomPhotos.mockRejectedValue(new Error('API error'))
    const galleryStore = useGalleryStore()

    const fetchRandomPhotosPromise = galleryStore.fetchRandomPhotos()
    expect(galleryStore.isLoadingRandomPhotos).toBe(true)
    expect(galleryStore.randomPhotos).toEqual([])

    await fetchRandomPhotosPromise
    expect(galleryStore.isLoadingRandomPhotos).toBe(false)
    expect(galleryStore.randomPhotos).toEqual([])
    expect(vi.mocked(api).getRandomPhotos).toHaveBeenCalled()
    expect(vi.mocked(notify)).toHaveBeenCalledWith({ title: 'Ошибка при загрузке фотографий', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
  })

  it('isSearchEmpty returns true if searchTerm is empty', () => {
    const galleryStore = useGalleryStore()
    galleryStore.changeSearchTerm('')

    expect(galleryStore.isSearchEmpty).toBe(true)
  })

  it('isSearchEmpty returns false if searchTerm is not empty', () => {
    const galleryStore = useGalleryStore()
    galleryStore.changeSearchTerm('example search term')

    expect(galleryStore.isSearchEmpty).toBe(false)
  })

  it('hasNoResults returns true if photos are empty', () => {
    const galleryStore = useGalleryStore()
    galleryStore.photos = null
    galleryStore.searchTerm = 'example search term'

    expect(galleryStore.hasNoResults).toBe(true)
  })

  it('hasPhotos returns true if photos are not empty', () => {
    const galleryStore = useGalleryStore()
    galleryStore.photos = { results: [mockPhoto], total_pages: 1, total: 1 }
    galleryStore.searchTerm = 'example search term'

    expect(galleryStore.hasPhotos).toBe(true)
  })

  it('hasPhotos returns false if photos are empty', () => {
    const galleryStore = useGalleryStore()
    galleryStore.photos = null
    galleryStore.searchTerm = 'example search term'

    expect(galleryStore.hasPhotos).toBe(false)
  })

  it ('hasNoResults returns false if photos are not empty', () => {
    const galleryStore = useGalleryStore()
    galleryStore.photos = { results: [mockPhoto], total_pages: 1, total: 1 }
    galleryStore.searchTerm = 'example search term'

    expect(galleryStore.hasNoResults).toBe(false)
  })

  it('hasNoResult return false while loading photos', () => {
    const galleryStore = useGalleryStore()
    galleryStore.isLoadingPhotos = true

    expect(galleryStore.hasNoResults).toBe(false)
  })
})
