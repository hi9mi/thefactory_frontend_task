import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import FavoritePhotosPage from './favorite-photos-page.vue'

const repoItems = ref<any[]>([])
const repo = {
  items: repoItems,
  has: () => false,
  add: () => {},
  remove: () => {},
  clear: () => {},
}
vi.mock('@tf-app/shared/di', () => ({
  useDependency: () => repo,
}))

vi.mock('@tf-app/shared/libs', () => ({
  usePaginationData: (sourceRef: any, opts: { currentPage: any, limit: number }) => {
    const data = computed(() => {
      const pageNum = Number(opts.currentPage.value || 1)
      const start = (pageNum - 1) * opts.limit
      return sourceRef.value.slice(start, start + opts.limit)
    })
    const totalPages = computed(() => {
      const n = Math.ceil((sourceRef.value.length || 0) / opts.limit)
      return Number.isFinite(n) ? n : 0
    })
    const changePage = (p: number) => {
      opts.currentPage.value = p
    }
    return { data, totalPages, changePage }
  },
  generateId: () => 'p1',
}))

const pageRef = ref<number | string>(1)
vi.mock('@vueuse/router', () => ({
  useRouteQuery: (_name: string, _def: string, _opts: any) => pageRef,
}))

const TfMasonryGridStub = {
  name: 'TfMasonryGrid',
  props: ['items', 'loading', 'skeletonCount', 'initialItemsCount', 'maxCols', 'getAspectRatio'],
  template: `
    <section data-stub="grid" data-count="items?.length ?? 0">
      <slot v-for="it in items" name="default" :item="it" />
    </section>
  `,
}
const TfPhotoCardStub = {
  name: 'TfPhotoCard',
  props: ['photo'],
  template: `<article data-testid="photo-card" :data-id="photo?.id"></article>`,
}
const TfPaginationStub = {
  name: 'TfPagination',
  props: ['totalPages', 'page'],
  template: `<nav v-bind="$attrs" data-stub="pagination"><slot/></nav>`,
}
const TfAffixStub = {
  name: 'TfAffix',
  template: `<div v-bind="$attrs" data-stub="affix"></div>`,
}

function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    urlRaw: 'raw',
    urlFull: 'full',
    blurHash: null,
    alt: `photo ${i + 1}`,
    w: 1000,
    h: 800,
  }))
}

function mountPage() {
  return mount(FavoritePhotosPage, {
    global: {
      stubs: {
        TfMasonryGrid: TfMasonryGridStub,
        TfPhotoCard: TfPhotoCardStub,
        TfPagination: TfPaginationStub,
        TfAffix: TfAffixStub,
      },
    },
    attachTo: document.body,
  })
}

describe('favorite-photos page', () => {
  beforeEach(() => {
    repoItems.value = []
    pageRef.value = 1

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
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should show empty state when there are no favorites', () => {
    const wrapper = mountPage()
    expect(wrapper.find('[data-testid="favorites-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="affix"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should render photo cards for current page, show pagination and affix', async () => {
    repoItems.value = makeItems(20)
    const wrapper = mountPage()
    await nextTick()

    const cards = wrapper.findAll('[data-testid="photo-card"]')
    expect(cards.length).toBe(18)
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="affix"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('should change page on "change-page" and update rendered items', async () => {
    repoItems.value = makeItems(20)
    const wrapper = mountPage()
    await nextTick()

    expect(wrapper.findAll('[data-testid="photo-card"]').length).toBe(18)

    const pag = wrapper.findComponent({ name: 'TfPagination' })
    expect(pag.exists()).toBe(true)
    pag.vm.$emit('change-page', 2)
    await nextTick()

    expect(pageRef.value).toBe(2)
    expect(wrapper.findAll('[data-testid="photo-card"]').length).toBe(2)

    wrapper.unmount()
  })
})
