import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { mount } from '@vue/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockPhoto } from '../mocks/photo'

describe('tf-photo-card widget', () => {
  let wrapper: ReturnType<typeof mount<typeof TfPhotoCard>>

  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      drawImage: vi.fn(),
    })

    vi.mock('@tf-app/shared/ui/data-display/tf-blurhash-image/decode', () => ({
      decodeWorker: {
        postMessage: vi.fn().mockImplementation(() => {}),
        addEventListener: vi.fn().mockImplementation((_, handler, __) => {
          handler({ data: { payload: {
            id: mockPhoto.id,
            bitmap: {
              close: vi.fn(),
              height: 440,
              width: 440,
            } satisfies ImageBitmap,
          } } })
        }),
        removeEventListener: vi.fn().mockImplementation(() => {}),
      },
    }))

    wrapper = mount(TfPhotoCard, {
      props: {
        photo: mockPhoto,
      },
      global: {
        stubs: ['RouterLink', 'ToggleFavoritePhoto', 'DownloadPhoto'],
      },
      attachTo: document.body,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
    // @ts-expect-error cleanup wrapper
    wrapper = undefined
  })

  it('should renders TfBlurhashImage with correct props', () => {
    const expectedProps = {
      id: mockPhoto.id,
      src: `${mockPhoto.urls.raw}&w=640&h=640&dpr=2&q=80`,
      alt: mockPhoto.alt_description,
      blurhash: mockPhoto.blur_hash,
      sizes: '(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px',
      srcset: `${mockPhoto.urls.raw}&w=320&h=320&dpr=1&q=80 320w, ${mockPhoto.urls.raw}&w=640&h=640&dpr=2&q=80 640w, ${mockPhoto.urls.raw}&w=1024&h=1024dpr=3&q=80 1024w`,
      blurhashWidth: 440,
      blurhashHeight: 440,
    }

    const blurhashImage = wrapper.findComponent({ name: 'TfBlurhashImage' })

    expect(blurhashImage.props()).toEqual(expectedProps)
  })

  it('should navigate to correct URL when photo is clicked', () => {
    const routerLink = wrapper.findComponent({ name: 'RouterLink' })

    expect(routerLink.attributes('to')).toBe(`/${mockPhoto.id}`)
  })
})
