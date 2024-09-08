import ShowFullPhoto from '@tf-app/features/show-full-photo/show-full-photo.vue'
import { routes } from '@tf-app/routing'
import { mount } from '@vue/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute, useRouter } from 'vue-router'

import { mockPhoto } from '../mocks/photo'

const mockedFn = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockedFn,
    replace: mockedFn,
  }),
  useRoute: vi.fn(),
}))
vi.mock('@tf-app/shared/libs', () => ({
  useFocusTrap: () => ({
    trapRef: {},
    initFocusTrap: vi.fn(),
    clearFocusTrap: vi.fn(),
  }),
}))

describe('show full photo feature', () => {
  let wrapper: ReturnType<typeof mount<typeof ShowFullPhoto>>

  beforeEach(() => {
    // @ts-expect-error mock
    useRoute.mockReturnValue({
      params: {
        photoId: mockPhoto.id,
      },
    })
    wrapper = mount(ShowFullPhoto, {
      props: {
        photo: mockPhoto,
        description: mockPhoto.alt_description,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
    // @ts-expect-error cleanup wrapper
    wrapper = undefined
  })

  it('creates and removes the full photo container on mount and unmount', () => {
    expect(document.getElementById('full-photo')).not.toBeNull()

    wrapper.unmount()
    expect(document.getElementById('full-photo')).toBeNull()
  })

  it('closes the full photo on Escape key', async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted()).toHaveProperty('hideFullPhoto')
    expect(useRouter().push).toHaveBeenCalledWith({
      name: routes.photoPage.name,
      params: { id: useRoute().params.id },
    })
  })

  it('navigates to the photo page on close', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(useRouter().push).toHaveBeenCalledWith({
      name: routes.photoPage.name,
      params: { id: useRoute().params.id },
    })
  })

  it('removes the lock-scrollbar class on route change', () => {
    expect(document.documentElement.classList.contains('lock-scrollbar')).toBe(true)
    wrapper.unmount()
    expect(document.documentElement.classList.contains('lock-scrollbar')).toBe(false)
  })

  it('closes the full photo on overlay click', async () => {
    await wrapper.find('div[data-testid="full-photo-overlay"]').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('hideFullPhoto')
    expect(useRouter().push).toHaveBeenCalledWith({
      name: routes.photoPage.name,
      params: { id: useRoute().params.id },
    })
  })

  it('closes the full photo on overlay keydown', async () => {
    await wrapper.find('div[data-testid="full-photo-overlay"]').trigger('keydown', { key: ' ' })

    expect(wrapper.emitted()).toHaveProperty('hideFullPhoto')
    expect(useRouter().push).toHaveBeenCalledWith({
      name: routes.photoPage.name,
      params: { id: useRoute().params.id },
    })
  })
})
