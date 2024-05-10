import { useRoute, useRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { routes } from '@tf-app/routing'
import { mockPhoto } from '@tf-app/shared/__mocks__/photo'

import ShowFullPhoto from './show-full-photo.vue'

const mockedPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockedPush,
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
    expect(document.body.classList.contains('lock-scrollbar')).toBe(true)
    wrapper.unmount()
    expect(document.body.classList.contains('lock-scrollbar')).toBe(false)
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
