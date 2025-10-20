import { useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import { mount } from '@vue/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import GalleryPage from './gallery-page.vue'

const notifierMock = { error: vi.fn(), info: vi.fn(), success: vi.fn(), warning: vi.fn() }
vi.mock(import('@tf-app/shared/libs'), async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tf-app/shared/libs')>()
  return {
    ...actual,
    useDependency: vi.fn(),
  }
})

const galleryState = {
  random: ref<any[]>([]),
  randomLoading: ref(false),
  randomError: ref<string | null>(null),
  ensureRandom: vi.fn<any>(),
}
vi.mock('@tf-app/entities/gallery', () => ({
  createGalleryGateway: vi.fn(() => ({})),
  createGalleryEntity: vi.fn(() => galleryState),
}))

const SearchPhotosFormStub = {
  name: 'SearchPhotosForm',
  template: `<form data-testid="search-photos-form"></form>`,
}
const TMasonryGridStub = {
  name: 'TMasonryGrid',
  props: ['items', 'loading', 'skeletonCount', 'initialItemsCount', 'maxCols', 'getAspectRatio'],
  template: `<section data-stub="grid">
    <slot v-for="it in items" name="default" :item="it" />
  </section>`,
}
const TfPhotoCardStub = {
  name: 'TfPhotoCard',
  props: ['photo'],
  template: `<article data-testid="photo-card" :data-id="photo?.id"></article>`,
}
const TfAffixStub = {
  name: 'TfAffix',
  template: `<div data-testid="affix"></div>`,
}

function mountPage() {
  return mount(GalleryPage, {
    global: {
      stubs: {
        SearchPhotosForm: SearchPhotosFormStub,
        TMasonryGrid: TMasonryGridStub,
        TfPhotoCard: TfPhotoCardStub,
        TfAffix: TfAffixStub,
      },
    },
    attachTo: document.body,
  })
}

describe('gallery page', () => {
  beforeEach(() => {
    galleryState.random.value = []
    galleryState.randomLoading.value = false
    galleryState.randomError.value = null
    galleryState.ensureRandom.mockReset()
    notifierMock.error.mockReset()

    vi.mock('@tf-app/shared/ui/data-display/tf-blurhash-image/decode', () => ({
      decodeWorker: {
        postMessage: vi.fn().mockImplementation(() => {}),
        addEventListener: vi.fn().mockImplementation((_, handler, __) => {
          handler({ data: { payload: {
            id: 'p1',
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
    vi.mocked(useDependency).mockImplementation((token) => {
      if (token === NOTIFIER_TOKEN) {
        return notifierMock
      }
      return {}
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should call ensureRandom with BATCH=18 and AbortSignal on mount', async () => {
    const wrapper = mountPage()
    await nextTick()

    expect(galleryState.ensureRandom).toHaveBeenCalledTimes(1)
    const [count, init] = galleryState.ensureRandom.mock.calls[0]
    expect(count).toBe(18)
    expect((init as any)?.signal).toBeInstanceOf(AbortSignal)

    wrapper.unmount()
  })

  it('should render SearchPhotosForm, grid with photo cards, and affix', async () => {
    galleryState.random.value = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }]
    const wrapper = mountPage()
    await nextTick()

    expect(wrapper.find('[data-testid="search-photos-form"]').exists()).toBe(true)
    const cards = wrapper.findAll('[data-testid="photo-card"]')
    expect(cards.length).toBe(3)
    expect(cards[0].attributes('data-id')).toBe('p1')
    expect(wrapper.find('[data-testid="affix"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('should notify error when randomError becomes non-null', async () => {
    const wrapper = mountPage()
    await nextTick()

    galleryState.randomError.value = 'Boom'
    await nextTick()

    expect(notifierMock.error).toHaveBeenCalledWith('Boom', 'Failed load photos')
    wrapper.unmount()
  })

  it('should abort the in-flight request on unmount (signal.aborted = true)', async () => {
    const wrapper = mountPage()
    await nextTick()

    const init = galleryState.ensureRandom.mock.calls[0]?.[1]
    const signal: AbortSignal | undefined = (init as any)?.signal

    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal!.aborted).toBe(false)

    wrapper.unmount()

    expect(signal!.aborted).toBe(true)
  })
})
