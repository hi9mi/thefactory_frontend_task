import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive, ref } from 'vue'

const notifier = { error: vi.fn(), info: vi.fn(), success: vi.fn(), warning: vi.fn() }
vi.mock('@tf-app/shared/di', () => {
  const TOKENS = {
    UnsplashAPI: Symbol('UnsplashAPI'),
    Notifier: Symbol('Notifier'),
    LRUCache: Symbol('LRUCache'),
  }
  return {
    TOKENS,
    useDependency: (token: unknown) => (token === TOKENS.Notifier ? notifier : ({} as any)),
  }
})

const cancelDebounce = vi.fn()
const debouncedSpy = vi.fn()
vi.mock('@tf-app/shared/libs', () => ({
  debounce: (fn: (...a: any[]) => Promise<any>, _wait: number) => {
    const wrapped = (...args: any[]) => {
      debouncedSpy(...args)
      return fn(...args)
    }
    return [wrapped, cancelDebounce] as const
  },
  generateId: () => {},
}))

const qRef = ref<string>('')
const pageRef = ref<number>(1)
vi.mock('@vueuse/router', () => ({
  useRouteQuery: (name: string, _def: any, _opts: any) => (name === 'q' ? qRef : pageRef),
}))

interface Entry { items: any[], loading: boolean, error: string | null }
const entry: Entry = reactive({ items: [], loading: false, error: null })
const lastSignals: AbortSignal[] = []
const searchMock = vi.fn(
  async ({ query, page, perPage }: { query: string, page: number, perPage: number }, init?: RequestInit) => {
    entry.loading = true
    lastSignals.push(init?.signal as AbortSignal)
    await Promise.resolve()
    entry.items = query ? Array.from({ length: Math.min(perPage, 3) }, (_, i) => ({ id: `${query}-${page}-${i + 1}` })) : []
    entry.loading = false
    return entry.items
  },
)
const getStateMock = vi.fn((_q: string, _p: number) => entry)
const getTotalPagesMock = vi.fn((q: string) => (q.trim() ? 3 : 0))

vi.mock('@tf-app/entities/gallery', () => ({
  createGalleryGateway: vi.fn(() => ({})),
  createGalleryEntity: vi.fn(() => ({
    search: searchMock,
    getSearchState: getStateMock,
    getTotalPages: getTotalPagesMock,
  })),
}))

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

const SearchPhotosFormStub = {
  name: 'SearchPhotosForm',
  props: ['modelValue', 'mode'],
  emits: ['update:modelValue', 'submit'],
  template: `<form data-testid="search-photos-form"></form>`,
}

const TfMasonryGridStub = {
  name: 'TfMasonryGrid',
  props: ['items', 'loading', 'skeletonCount', 'initialItemsCount', 'maxCols', 'getAspectRatio'],
  template: `<section data-stub="grid" :data-loading="!!loading">
    <slot v-for="it in items" name="default" :item="it" />
  </section>`,
}

const TfPhotoCardStub = {
  name: 'TfPhotoCard',
  props: ['photo'],
  template: `<article data-testid="photo-card" :data-id="photo?.id"></article>`,
}

const TfPaginationStub = {
  name: 'TfPagination',
  props: ['totalPages', 'page', 'disabled'],
  template: `<nav data-testid="pagination"><button @click="$emit('change-page', page + 1)"/></nav>`,
}

const TfAffixStub = { name: 'TfAffix', template: `<div data-testid="affix"></div>` }

// eslint-disable-next-line import/first
import SearchPage from './search-page.vue'

function mountPage() {
  return mount(SearchPage, {
    global: {
      stubs: {
        SearchPhotosForm: SearchPhotosFormStub,
        TfMasonryGrid: TfMasonryGridStub,
        TfPhotoCard: TfPhotoCardStub,
        TfPagination: TfPaginationStub,
        TfAffix: TfAffixStub,
      },
    },
    attachTo: document.body,
  })
}

describe('search page', () => {
  beforeEach(() => {
    notifier.error.mockReset()
    searchMock.mockClear()
    debouncedSpy.mockClear()
    cancelDebounce.mockClear()
    entry.items = []
    entry.loading = false
    entry.error = null
    qRef.value = ''
    pageRef.value = 1
    lastSignals.length = 0
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render search form and affix; show empty search message when q is empty', async () => {
    const wrapper = mountPage()
    await nextTick()

    expect(wrapper.find('[data-testid="search-photos-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="affix"]').exists()).toBe(true)

    expect(wrapper.find('[data-stub="grid"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="search-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="no-results"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('should search when q changes, pass AbortSignal, render grid/cards and pagination', async () => {
    const wrapper = mountPage()
    await nextTick()

    qRef.value = 'cats'
    await nextTick() // trigger watch
    await nextTick()

    expect(debouncedSpy).toHaveBeenCalledWith('cats', 1, expect.any(Object))
    expect(searchMock).toHaveBeenCalledWith(
      { query: 'cats', page: 1, perPage: 18 },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.find('[data-stub="grid"]').exists()).toBe(true)

    const cards = wrapper.findAll('[data-testid="photo-card"]')
    expect(cards.length).toBeGreaterThan(0)
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('should reset page to 1 when q changes and current page is not 1', async () => {
    const wrapper = mountPage()
    await nextTick()

    pageRef.value = 3
    await nextTick()

    qRef.value = 'dogs'
    await nextTick()

    expect(pageRef.value).toBe(1)
    wrapper.unmount()
  })

  it('should abort previous request when q changes quickly', async () => {
    const wrapper = mountPage()
    await nextTick()

    qRef.value = 'first'
    await nextTick()

    qRef.value = 'second'
    await nextTick()

    expect(lastSignals.length).toBeGreaterThanOrEqual(2)
    expect(lastSignals[0].aborted).toBe(true)

    wrapper.unmount()
  })

  it('should update page on pagination "change-page" emit', async () => {
    qRef.value = 'cats'
    const wrapper = mountPage()
    await nextTick()
    await nextTick()

    await wrapper.get('[data-testid="pagination"] button').trigger('click')
    await nextTick()

    expect(pageRef.value).toBe(2)
    wrapper.unmount()
  })

  it('should notify error when entry.error becomes non-null', async () => {
    const wrapper = mountPage()
    await nextTick()

    entry.error = 'Boom'
    await nextTick()

    expect(notifier.error).toHaveBeenCalledWith('Boom', 'Failed search photos')
    wrapper.unmount()
  })
})
