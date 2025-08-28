import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TfPhotoCard from './tf-photo-card.vue'

const TfBlurhashImageStub = {
  name: 'TfBlurhashImage',
  props: [
    'id',
    'blurhash',
    'blurhashWidth',
    'blurhashHeight',
    'src',
    'alt',
    'srcset',
    'sizes',
  ],
  template: `
    <img data-stub="blurhash"
         :data-id="id"
         :data-blurhash="blurhash"
         :data-src="src"
         :data-alt="alt"
         :data-srcset="srcset"
         :data-sizes="sizes" />
  `,
}

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to', 'title'],
  template: `<a :data-to="to" :title="title"><slot/></a>`,
}

const ToggleFavoritePhotoStub = {
  name: 'ToggleFavoritePhoto',
  props: ['photo'],
  template: `<div data-stub="toggle-fav" :data-photo-id="photo?.id"></div>`,
}

const DownloadPhotoStub = {
  name: 'DownloadPhoto',
  props: ['src', 'name'],
  template: `<div data-stub="download" :data-src="src" :data-name="name"></div>`,
}

function makePhoto() {
  return {
    id: 'p123',
    blurHash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    urlRaw: 'https://img.test/raw',
    urlFull: 'https://img.test/full',
    alt: 'A scenic view',
    color: '#abcdef',
    w: 1000,
    h: 800,
  } as any
}

function mountCmp(photo = makePhoto()) {
  return mount(TfPhotoCard, {
    props: { photo },
    global: {
      stubs: {
        TfBlurhashImage: TfBlurhashImageStub,
        RouterLink: RouterLinkStub,
        ToggleFavoritePhoto: ToggleFavoritePhotoStub,
        DownloadPhoto: DownloadPhotoStub,
      },
    },
  })
}

describe('tf-photo-card widget', () => {
  beforeEach(() => {
    vi.mock('@tf-app/shared/ui/data-display/tf-blurhash-image/decode', () => ({
      decodeWorker: {
        postMessage: vi.fn().mockImplementation(() => {}),
        addEventListener: vi.fn().mockImplementation((_, handler, __) => {
          handler({ data: { payload: {
            id: makePhoto().id,
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
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render TfBlurhashImage with correct props', () => {
    const photo = makePhoto()
    const wrapper = mountCmp(photo)

    const img = wrapper.get('[data-stub="blurhash"]')
    expect(img.attributes('data-id')).toBe('p123')
    expect(img.attributes('data-blurhash')).toBe(photo.blurHash)

    const src = img.attributes('data-src')!
    expect(src).toContain(photo.urlRaw)
    expect(src).toContain('w=640')
    expect(src).toContain('h=640')
    expect(src).toContain('dpr=2')
    expect(src).toContain('q=80')

    expect(img.attributes('data-alt')).toBe(photo.alt)

    const srcset = img.attributes('data-srcset')!
    expect(srcset).toContain(`${photo.urlRaw}&w=320&h=320&dpr=1&q=80 320w`)
    expect(srcset).toContain(`${photo.urlRaw}&w=640&h=640&dpr=2&q=80 640w`)
    expect(srcset).toContain(`${photo.urlRaw}&w=1024&h=1024&dpr=3&q=80 1024w`)

    const sizes = img.attributes('data-sizes')!
    expect(sizes).toBe('(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px')

    wrapper.unmount()
  })

  it('should link to details page with RouterLink and set title', () => {
    const photo = makePhoto()
    const wrapper = mountCmp(photo)

    const link = wrapper.get('a[data-to]')
    expect(link.attributes('data-to')).toBe(`/${photo.id}`)
    expect(link.attributes('title')).toBe(photo.alt)

    wrapper.unmount()
  })

  it('should render overlay for actions', () => {
    const wrapper = mountCmp()
    expect(wrapper.find('[data-testid="photo-actions-overlay"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should pass photo to ToggleFavoritePhoto and url/name to DownloadPhoto', () => {
    const photo = makePhoto()
    const wrapper = mountCmp(photo)

    const fav = wrapper.get('[data-stub="toggle-fav"]')
    expect(fav.attributes('data-photo-id')).toBe(photo.id)

    const dl = wrapper.get('[data-stub="download"]')
    expect(dl.attributes('data-src')).toBe(photo.urlFull)
    expect(dl.attributes('data-name')).toBe(photo.id)

    wrapper.unmount()
  })
})
