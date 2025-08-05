import TfHeader from '@tf-app/widgets/tf-header/tf-header.vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'

import { useRoute } from 'vue-router'

import SearchIcon from '~icons/tf-icons/search'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
}))
describe('tf-header widget', () => {
  let wrapper: ReturnType<typeof mount<typeof TfHeader>>

  beforeEach(() => {
    const RouterLinkStub = {
      template: '<div><slot></slot></div>',
    }

    // @ts-expect-error mock
    useRoute.mockReturnValue(reactive({
      path: '/',
    }))
    wrapper = mount(TfHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
    // @ts-expect-error cleanup wrapper
    wrapper = undefined
  })

  it('should shows search icon when not on search route', () => {
    expect(wrapper.findComponent(SearchIcon).exists()).toBe(true)
  })

  it('should hides search icon when on search route', async () => {
    useRoute().path = '/search'

    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(SearchIcon).exists()).toBe(false)
  })
})
