import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import ShowFullPhoto from './show-full-photo.vue'

vi.mock('@tf-app/routing', () => ({
  routes: { photoPage: { name: 'photo' } },
}))

const replaceMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useRoute: () => ({ params: { id: '42' } }),
}))

vi.mock('@tf-app/shared/libs', () => ({
  useFocusTrap: () => ({ trapRef: ref<HTMLElement | null>(null) }),
}))

describe('show-full-photo feature', () => {
  let wrapper: ReturnType<typeof mount<typeof ShowFullPhoto>>

  beforeEach(() => {
    vi.restoreAllMocks()
    replaceMock.mockReset()

    vi.spyOn(globalThis, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
    if (wrapper) {
      wrapper.unmount()
      // @ts-expect-error cleanup
      wrapper = undefined
    }
    const leftover = document.getElementById('full-photo')
    if (leftover && leftover.parentNode)
      leftover.parentNode.removeChild(leftover)
  })

  function mountCmp() {
    wrapper = mount(ShowFullPhoto, {
      attachTo: document.body,
      props: {
        src: 'https://img.test/photo',
        description: 'Alt text',
      },
    })
    return wrapper
  }

  it('should create teleport container and lock scrolling on mount', async () => {
    mountCmp()
    await nextTick()

    const container = document.getElementById('full-photo')
    expect(container).toBeTruthy()
    expect(document.documentElement.classList.contains('lock-scrollbar')).toBe(true)
  })

  it('should route back and emit on overlay click', async () => {
    mountCmp()
    await nextTick()

    const overlay = document.querySelector('[data-testid="full-photo-overlay"]') as HTMLElement
    expect(overlay).toBeTruthy()

    overlay.click()
    await nextTick()

    expect(replaceMock).toHaveBeenCalledWith({
      name: 'photo',
      params: { id: '42' },
    })
    const emitted = wrapper.emitted('hideFullPhoto')
    expect(emitted && emitted.length).toBe(1)
  })

  it('should route back and emit on overlay Space keydown', async () => {
    mountCmp()
    await nextTick()

    const overlay = document.querySelector('[data-testid="full-photo-overlay"]') as HTMLElement
    overlay.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    await nextTick()

    expect(replaceMock).toHaveBeenCalledWith({
      name: 'photo',
      params: { id: '42' },
    })
    expect(wrapper.emitted('hideFullPhoto')?.length).toBeGreaterThan(0)
  })

  it('should route back and emit on Escape key', async () => {
    mountCmp()
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(replaceMock).toHaveBeenCalledWith({
      name: 'photo',
      params: { id: '42' },
    })
    expect(wrapper.emitted('hideFullPhoto')?.length).toBeGreaterThan(0)
  })

  it('should route back and emit on close button click', async () => {
    mountCmp()
    await nextTick()

    const btn = document.querySelector('[data-testid="close-preview-btn"]') as HTMLElement
    expect(btn).toBeTruthy()

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(replaceMock).toHaveBeenCalledWith({
      name: 'photo',
      params: { id: '42' },
    })
    expect(wrapper.emitted('hideFullPhoto')?.length).toBeGreaterThan(0)
  })

  it('should render img with computed src, srcset and alt', async () => {
    mountCmp()
    await nextTick()

    const img = document.querySelector('img') as HTMLImageElement
    expect(img).toBeTruthy()
    expect(img.alt).toBe('Alt text')
    expect(img.src).toContain('https://img.test/photo')
    expect(img.getAttribute('srcset')).toBeTruthy()
  })

  it('should cleanup on unmount: remove container, class and restore scroll', async () => {
    mountCmp()
    await nextTick()

    const container = document.getElementById('full-photo')
    expect(container).toBeTruthy()

    wrapper.unmount()

    const after = document.getElementById('full-photo')
    expect(after).toBeNull()

    expect(document.documentElement.classList.contains('lock-scrollbar')).toBe(false)
    expect(document.documentElement.style.top).toBe('')

    expect(globalThis.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  })
})
