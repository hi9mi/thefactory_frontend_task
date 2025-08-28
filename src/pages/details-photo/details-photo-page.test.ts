import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'

vi.mock('@tf-app/routing', () => ({
  routes: {
    photoPage: { name: 'photo', children: { fullPhoto: { name: 'photo:full' } } },
  },
}))

const notifierMock = { error: vi.fn(), info: vi.fn(), success: vi.fn(), warning: vi.fn() }
vi.mock('@tf-app/shared/di', () => ({
  TOKENS: { UnsplashAPI: Symbol('UnsplashAPI'), Notifier: Symbol('Notifier'), LRUCache: Symbol('LRUCache') },
  useDependency: (token: any) => {
    if (String(token).includes('Notifier'))
      return notifierMock
    if (String(token).includes('UnsplashAPI'))
      return {} as any
    if (String(token).includes('LRUCache'))
      return {} as any
    return {} as any
  },
}))

const pushMock = vi.fn()
const replaceMock = vi.fn()
const routeState = reactive({ params: { id: 'p1' }, path: '/photo/p1' })
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
  useRoute: () => routeState,
}))

vi.mock('@tf-app/shared/libs', () => ({
  computeRelativeBrightness: () => 0,
  hexToRgb: () => ({ r: 0, g: 0, b: 0 }),
  generateId: () => 'p1',
}))

interface Entry { item: any | null, loading: boolean, error: string | null }
const entry: Entry = reactive({ item: null, loading: true, error: null })
const ensureMock = vi.fn<any>()
const getStateMock = vi.fn((_: string) => entry)
vi.mock('@tf-app/entities/details-photo', () => ({
  createPhotoDetailsGateway: vi.fn(() => ({})),
  createPhotoDetailsEntity: vi.fn(() => ({
    ensure: (...args: any[]) => ensureMock(...(args as any)),
    getState: (id: string) => getStateMock(id),
  })),
}))

const TfActionButtonStub = { template: `<button v-bind="$attrs"><slot/></button>` }
const TfBlurhashImageStub = {
  props: ['id', 'blurhash', 'blurhashWidth', 'blurhashHeight', 'src', 'srcset', 'sizes', 'alt'],
  template: `<img data-stub="blurhash" :data-id="id" :data-alt="alt" :src="src" />`,
}
const ToggleFavoritePhotoStub = { props: ['photo'], template: `<div data-stub="toggle-fav" :data-id="photo?.id"/>` }
const DownloadPhotoStub = { props: ['src', 'name', 'withText'], template: `<div data-stub="download" :data-src="src" :data-name="name"/>` }
const RouterLinkStub = { props: ['to', 'title'], template: `<a :data-to="typeof to==='string'?to:to?.path" :title="title"><slot/></a>` }
const RouterViewStub = { template: `<div data-stub="router-view"><slot :Component="null"/></div>` }

// eslint-disable-next-line
import DetailsPhotoPage from './details-photo-page.vue'

function mountPage() {
  return mount(DetailsPhotoPage, {
    global: {
      stubs: {
        TfActionButton: TfActionButtonStub,
        TfBlurhashImage: TfBlurhashImageStub,
        ToggleFavoritePhoto: ToggleFavoritePhotoStub,
        DownloadPhoto: DownloadPhotoStub,
        RouterLink: RouterLinkStub,
        RouterView: RouterViewStub,
        FullScreenIcon: { template: '<svg />' },
      },
    },
    attachTo: document.body,
  })
}

describe('details-photo page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    pushMock.mockReset()
    replaceMock.mockReset()
    notifierMock.error.mockReset()
    ensureMock.mockReset()
    Object.assign(entry, { item: null, loading: true, error: null })
    routeState.params.id = 'p1'
    routeState.path = '/photo/p1'

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

  it('should show loader when loading and no item', async () => {
    const wrapper = mountPage()
    await nextTick()
    expect(wrapper.find('[data-testid="loader"]').exists()).toBe(true)
    expect(ensureMock).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should render details when item is loaded', async () => {
    const wrapper = mountPage()

    Object.assign(entry, {
      loading: false,
      item: {
        id: 'p1',
        urlRaw: 'https://img.test/raw',
        urlFull: 'https://img.test/full',
        alt: 'Alt',
        blurHash: 'hash',
        author: 'Alice',
        authorUsername: 'alice',
        authorAvatar: 'https://img.test/avatar',
        color: '#000000',
      },
      error: null,
    })
    await nextTick()

    const bg = document.querySelector('[data-testid="photo-bg"]') as HTMLImageElement
    expect(bg).toBeTruthy()
    expect(bg.src).toContain('https://img.test/raw')
    expect(wrapper.get('[data-testid="user-name"]').text()).toBe('Alice')
    expect(wrapper.get('[data-testid="user-nickname"]').text()).toBe('@alice')
    expect(wrapper.find('[data-stub="toggle-fav"]').attributes('data-id')).toBe('p1')
    expect(wrapper.find('[data-stub="download"]').attributes('data-src')).toBe('https://img.test/raw')

    wrapper.unmount()
  })

  it('should navigate to full photo on preview button click', async () => {
    const wrapper = mountPage()
    Object.assign(entry, {
      loading: false,
      item: { id: 'p1', urlRaw: 'https://img.test/raw', alt: 'Alt', blurHash: null, author: 'A', authorUsername: 'u', authorAvatar: '', color: '#000' },
      error: null,
    })
    await nextTick()

    await wrapper.get('[data-testid="preview-btn"]').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'photo:full' })
    wrapper.unmount()
  })

  it('should notify on error when entry.error becomes non-null', async () => {
    const wrapper = mountPage()
    Object.assign(entry, { loading: false, item: null, error: 'Boom' })
    await nextTick()
    expect(notifierMock.error).toHaveBeenCalledWith('Boom', 'Failed loading photo')
    wrapper.unmount()
  })

  it('should call ensure with AbortController signal when id changes', async () => {
    const wrapper = mountPage()
    await nextTick()

    expect(ensureMock).toHaveBeenCalled()
    const firstCallArgs = ensureMock.mock.calls[0]

    expect(firstCallArgs[0]).toBe('p1')
    expect((firstCallArgs[1] as any)?.signal).toBeInstanceOf(AbortSignal)

    routeState.params.id = 'p2'
    await nextTick()

    const secondCallArgs = ensureMock.mock.calls.at(-1)!
    expect(secondCallArgs[0]).toBe('p2')
    expect((secondCallArgs[1] as any)?.signal).toBeInstanceOf(AbortSignal)

    wrapper.unmount()
  })
})
