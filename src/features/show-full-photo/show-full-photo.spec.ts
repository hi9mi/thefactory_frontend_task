import { useRoute, useRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { routes } from '@tf-app/routing'
import type { Photo } from '@tf-app/shared/api'

import ShowFullPhoto from './show-full-photo.vue'

const mockPhoto = {
  id: '0NDeK_z7XT4',
  width: 2800,
  height: 3501,
  blur_hash: 'LKMZ?Z}l$1ngv#RO%gWrxCaKITs:',
  alt_description: 'a woman wearing a sweater and green sunglasses',
  urls: {
    raw: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3',
    full: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3&q=85',
    regular: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3&q=80&w=1080',
    small: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3&q=80&w=400',
    thumb: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3&q=80&w=200',
    small_s3: 'https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1712876718842-5b7d59ad453b',
  },
  links: {
    self: 'https://api.unsplash.com/photos/a-woman-wearing-a-sweater-and-green-sunglasses-0NDeK_z7XT4',
    html: 'https://unsplash.com/photos/a-woman-wearing-a-sweater-and-green-sunglasses-0NDeK_z7XT4',
    download: 'https://unsplash.com/photos/0NDeK_z7XT4/download?ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8',
    download_location: 'https://api.unsplash.com/photos/0NDeK_z7XT4/download?ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8',
  },
  user: {
    username: 'spliff_dj_joe',
    name: 'Dwayne joe',
    profile_image: {
      small: 'https://images.unsplash.com/profile-1651706213170-8be43fd00ae7?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32',
      medium: 'https://images.unsplash.com/profile-1651706213170-8be43fd00ae7?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64',
      large: 'https://images.unsplash.com/profile-1651706213170-8be43fd00ae7?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128',
    },
  },
} satisfies Photo

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

  it('removes the hidden class on route change', () => {
    expect(document.body.classList.contains('hidden')).toBe(true)
    wrapper.unmount()
    expect(document.body.classList.contains('hidden')).toBe(false)
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
