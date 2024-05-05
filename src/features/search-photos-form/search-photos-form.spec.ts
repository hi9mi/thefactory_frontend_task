import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import SearchPhotosForm from './search-photos-form.vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
}))
describe('search photos form feature', () => {
  beforeEach(() => {
    // @ts-expect-error mock
    useRoute.mockReturnValue(reactive({ query: { q: 'initial' } }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('emits the submit event with the search term', async () => {
    const wrapper = mount(SearchPhotosForm)
    const input = wrapper.find<HTMLInputElement>('#search-photos')
    const form = wrapper.find<HTMLFormElement>('form')

    expect(input.exists()).toBe(true)
    expect(form.exists()).toBe(true)
    expect(input.element.value).toBe('initial')

    await input.setValue('example search term')
    await form.trigger('submit')

    expect(wrapper.emitted()).toHaveProperty('submit')
    expect(wrapper.emitted('submit')?.[0]).toEqual(['example search term'])
  })

  it('change input value when route query changes', async () => {
    const wrapper = mount(SearchPhotosForm)

    const input = wrapper.find<HTMLInputElement>('#search-photos')

    expect(input.element.value).toBe('initial')

    const newQueryValue = 'updated'
    useRoute().query.q = newQueryValue

    await wrapper.vm.$nextTick()

    expect(input.element.value).toBe(newQueryValue)
  })
})
