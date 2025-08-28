import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'

import TfHeader from './tf-header.vue'

vi.mock('@tf-app/routing', () => ({
  routes: {
    search: { path: '/search' },
    gallery: { path: '/' },
    favorites: { path: '/favorites' },
  },
}))

let currentPath = '/'
vi.mock('vue-router', () => ({
  useRoute: () => reactive({ path: currentPath }),
}))

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to', 'title'],
  template: `<a :data-to="typeof to==='string' ? to : (to?.path ?? '')"><slot/></a>`,
}
const ToggleThemeStub = { name: 'ToggleTheme', template: `<button data-stub="toggle-theme" />` }
const HeartIconStub = { name: 'HeartIcon', template: `<svg data-stub="heart" />` }
const SearchIconStub = { name: 'SearchIcon', template: `<svg data-stub="search" />` }

function mountCmp() {
  return mount(TfHeader, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        ToggleTheme: ToggleThemeStub,
        HeartIcon: HeartIconStub,
        SearchIcon: SearchIconStub,
      },
    },
    attachTo: document.body,
  })
}

describe('tf-header widget', () => {
  beforeEach(() => {
    currentPath = '/'
  })

  it('should render logo link to gallery and favorites link', () => {
    const wrapper = mountCmp()

    const links = wrapper.findAll('a[data-to]')
    const toValues = links.map(a => a.attributes('data-to'))

    expect(toValues).toContain('/')
    expect(toValues).toContain('/favorites')
    expect(wrapper.find('[data-stub="toggle-theme"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('should show search link when not on search route', () => {
    currentPath = '/'
    const wrapper = mountCmp()

    const searchLink = wrapper.find('a[data-to="/search"]')
    expect(searchLink.exists()).toBe(true)
    expect(searchLink.text()).toContain('Поиск')

    wrapper.unmount()
  })

  it('should hide search link when on search route', () => {
    currentPath = '/search'
    const wrapper = mountCmp()

    const searchLink = wrapper.find('a[data-to="/search"]')
    expect(searchLink.exists()).toBe(false)
    expect(wrapper.find('a[data-to="/favorites"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('should keep favorites link text and icon structure', () => {
    const wrapper = mountCmp()
    const fav = wrapper.find('a[data-to="/favorites"]')
    expect(fav.exists()).toBe(true)
    expect(fav.text()).toContain('Избранное')

    expect(fav.find('svg').exists()).toBe(true)
    wrapper.unmount()
  })
})
