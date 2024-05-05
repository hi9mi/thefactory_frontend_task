import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { useRouteQuery } from '@vueuse/router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useFavoritePhotosStore } from '@tf-app/entities/favorite-photos'
import { mockFavoritePhoto, mockUnFavoritePhoto } from '@tf-app/shared/__mocks__/photo'
import TfButton from '@tf-app/shared/ui/buttons/tf-button/tf-button.vue'

import ToggleFavoritePhoto from './toggle-favorite-photo.vue'

import HeartIcon from '~icons/tf-icons/heart'

vi.mock('@vueuse/router', () => ({
  useRouteQuery: vi.fn(),
}))
describe('showFullPhoto', () => {
  let wrapper: ReturnType<typeof mount<typeof ToggleFavoritePhoto>>

  beforeEach(() => {
    // @ts-expect-error mock
    useRouteQuery.mockReturnValue(1)
    wrapper = mount(ToggleFavoritePhoto, {
      props: { photo: mockFavoritePhoto },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
    // @ts-expect-error cleanup wrapper
    wrapper = undefined
  })

  it('renders heart icon correctly based on favorite status', async () => {
    const favoritePhotosStore = useFavoritePhotosStore()
    favoritePhotosStore.$patch({ favoritePhotos: [mockFavoritePhoto] })
    await wrapper.vm.$nextTick()

    const heartIcon = wrapper.findComponent(HeartIcon)
    expect(heartIcon.classes()).toContain('favorite')

    favoritePhotosStore.$patch({ favoritePhotos: [mockUnFavoritePhoto] })
    await wrapper.vm.$nextTick()

    expect(heartIcon.classes()).not.toContain('favorite')
  })

  it('calls toggleFavoritePhoto on button click', async () => {
    const favoritePhotosStore = useFavoritePhotosStore()
    const toggleSpy = vi.spyOn(favoritePhotosStore, 'toggleFavoritePhoto')

    await wrapper.findComponent(TfButton).trigger('click')
    expect(toggleSpy).toHaveBeenCalledWith(mockFavoritePhoto)
  })
})
