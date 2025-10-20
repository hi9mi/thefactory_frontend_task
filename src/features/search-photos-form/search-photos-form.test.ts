import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SearchPhotosForm from './search-photos-form.vue'

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

const iconStub = { template: '<svg data-stub="search-icon"/>' }

function mountCmp(props: any = {}) {
  return mount(SearchPhotosForm, {
    props,
    global: {
      stubs: {
        SearchIcon: iconStub,
      },
    },
  })
}

describe('search-photos-form feature', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    pushMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should navigate to search route with query on submit (default mode=navigate)', async () => {
    const wrapper = mountCmp()
    const input = wrapper.get('input#search-photos')

    await input.setValue('cats')
    await wrapper.get('form').trigger('submit.prevent')

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({
      name: 'search',
      query: { q: 'cats', page: 1 },
    })
  })

  it('should emit "submit" with term in inline mode and not call router.push', async () => {
    const wrapper = mountCmp({ mode: 'inline' })
    const input = wrapper.get('input#search-photos')

    await input.setValue('dogs')
    await wrapper.get('form').trigger('submit.prevent')

    expect(pushMock).not.toHaveBeenCalled()
    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['dogs'])
  })

  it('should update v-model via input typing (update:modelValue)', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountCmp({ 'modelValue': '', 'onUpdate:modelValue': onUpdate })

    await wrapper.get('input#search-photos').setValue('bird')
    expect(onUpdate).toHaveBeenCalled()
    const last = onUpdate.mock.calls.at(-1)?.[0]
    expect(last).toBe('bird')
  })

  it('should have accessible attributes and structure', () => {
    const wrapper = mountCmp()
    const form = wrapper.find('form')
    const input = wrapper.find('input#search-photos')
    const button = wrapper.find('button[type="submit"]')

    expect(form.attributes('role')).toBe('search')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('aria-label')).toBe('Search photos')
    expect(button.exists()).toBe(true)
  })

  it('should submit via button click as well', async () => {
    const wrapper = mountCmp()
    await wrapper.get('input#search-photos').setValue('nature')

    await wrapper.get('button[type="submit"]').trigger('click')
    await wrapper.get('form').trigger('submit.prevent')

    expect(pushMock).toHaveBeenCalledWith({
      name: 'search',
      query: { q: 'nature', page: 1 },
    })
  })
})
