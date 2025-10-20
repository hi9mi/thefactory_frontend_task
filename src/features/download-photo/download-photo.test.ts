import DownloadPhoto from '@tf-app/features/download-photo/download-photo.vue'
import { useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const notifier = { warning: vi.fn() }
vi.mock(import('@tf-app/shared/libs'), async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tf-app/shared/libs')>()
  return {
    ...actual,
    useDependency: vi.fn(),
  }
})

describe('download photo feature', () => {
  let wrapper: ReturnType<typeof mount<typeof DownloadPhoto>>
  const mockBlob = new Blob(['test'], { type: 'image/jpeg' })

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    }))
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock'),
      revokeObjectURL: vi.fn(),
    })
    vi.mocked(useDependency).mockImplementation((token) => {
      if (token === NOTIFIER_TOKEN) {
        return notifier
      }
      return {}
    })

    wrapper = mount(DownloadPhoto, {
      props: { src: 'test-src', name: 'test-name', withText: true },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    if (wrapper)
      wrapper.unmount()
    // @ts-expect-error cleanup
    wrapper = undefined
  })

  it('should calls createObjectURL on button click', async () => {
    await wrapper.get('[data-testid="download-photo-btn"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
  })

  it('should calls revokeObjectURL on button click', async () => {
    await wrapper.get('[data-testid="download-photo-btn"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('should creates anchor, clicks it and removes it', async () => {
    const fakeAnchor = document.createElement('a')
    fakeAnchor.href = ''
    fakeAnchor.download = ''
    fakeAnchor.click = vi.fn()
    fakeAnchor.remove = vi.fn()

    const createElSpy = vi.spyOn(document, 'createElement')
    createElSpy.mockReturnValueOnce(fakeAnchor)

    await wrapper.get('[data-testid="download-photo-btn"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(createElSpy).toHaveBeenCalledWith('a')
    const anchor = createElSpy.mock.results[0].value as HTMLAnchorElement
    expect(anchor.download).toBe('test-name')
    expect(anchor.click).toHaveBeenCalled()
    expect(anchor.remove).toHaveBeenCalled()
    expect(notifier.warning).not.toHaveBeenCalled()
  })

  it('should uses default name "photo" when name is not provided', async () => {
    const w = mount(DownloadPhoto, {
      props: { src: 'test-src', withText: true },
    })

    ;(globalThis.fetch as any).mockResolvedValueOnce({ blob: () => Promise.resolve(mockBlob) })
    ;(globalThis.URL.createObjectURL as any).mockReturnValueOnce('blob:mock2')

    const fakeAnchor = document.createElement('a')
    fakeAnchor.click = vi.fn()
    fakeAnchor.remove = vi.fn()
    vi.spyOn(document, 'createElement').mockReturnValueOnce(fakeAnchor)

    await w.get('[data-testid="download-photo-btn"]').trigger('click')
    await w.vm.$nextTick()

    expect(fakeAnchor.download).toBe('photo')
    w.unmount()
  })

  it('should renders text when withText=true and hides it otherwise', async () => {
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Скачать')

    const w2 = mount(DownloadPhoto, { props: { src: 'x' } })
    expect(w2.find('span').exists()).toBe(false)
    w2.unmount()
  })

  it('should shows notifier.warning on error', async () => {
    ;(globalThis.fetch as any).mockRejectedValueOnce(new Error('fetch failed'))
    await wrapper.get('[data-testid="download-photo-btn"]').trigger('click')
    expect(notifier.warning).toHaveBeenCalledWith('Error while downloading photo', 'Error')
  })
})
