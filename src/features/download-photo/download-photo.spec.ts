import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'

import DownloadPhoto from './download-photo.vue'

vi.mock('@tf-app/shared/ui/feedback/tf-notification/libs', () => ({
  notify: vi.fn(),
}))

describe('download photo feature', () => {
  let wrapper: ReturnType<typeof mount<typeof DownloadPhoto>> | null = null
  const mockBlob = new Blob(['test'], { type: 'image/jpeg' })

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    }))
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(),
      revokeObjectURL: vi.fn(),
    })

    wrapper = mount(DownloadPhoto, {
      props: {
        src: 'test-src',
        name: 'test-name',
        withText: true,
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  afterAll(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    wrapper?.unmount()
    wrapper = null
  })

  it('calls createObjectURL on button click', async () => {
    await wrapper?.findComponent({ name: 'TfButton' }).trigger('click')

    await wrapper?.vm.$nextTick()

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
  })

  it('calls revokeObjectURL element on button click', async () => {
    await wrapper?.findComponent({ name: 'TfButton' }).trigger('click')

    await wrapper?.vm.$nextTick()
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledOnce()
  })

  it('create and remove anchor element on button click', async () => {
    const fakeAnchor = document.createElement('a')
    fakeAnchor.href = ''
    fakeAnchor.download = ''
    fakeAnchor.click = vi.fn()
    fakeAnchor.remove = vi.fn()

    const createElementSpy = vi.spyOn(document, 'createElement')
    createElementSpy.mockReturnValueOnce(fakeAnchor)

    await wrapper?.findComponent({ name: 'TfButton' }).trigger('click')
    await wrapper?.vm.$nextTick()

    expect(createElementSpy).toHaveBeenCalledWith('a')

    const anchorElement = createElementSpy.mock.results[0].value
    expect(anchorElement.click).toHaveBeenCalled()
    expect(anchorElement.remove).toHaveBeenCalled()
  })

  it('shows notification if download fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fetch failed')))

    await wrapper?.findComponent({ name: 'TfButton' }).trigger('click')

    expect(notify).toHaveBeenCalledWith({
      title: 'Не удалось начать загрузку фотографии',
      message: 'Что-то пошло не так, попробуйте еще раз',
      type: 'error',
    })
  })
})
