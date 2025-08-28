import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import ToggleTheme from './toggle-theme.vue'

vi.mock('@vueuse/core', () => {
  return {
    useDark: () => ref<boolean>(document.documentElement.classList.contains('dark')),
    useToggle: (r: { value: boolean }) => () => { r.value = !r.value },
  }
})

const SunAndMoonIconStub = { template: '<svg data-stub="sun-moon"/>' }

function mountCmp() {
  return mount(ToggleTheme, {
    global: {
      stubs: {
        SunAndMoonIcon: SunAndMoonIconStub,
      },
    },
    attachTo: document.body,
  })
}

describe('toggle-theme feature', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark', 'light')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark', 'light')
  })

  it('should render button with proper attributes', () => {
    const wrapper = mountCmp()
    const btn = wrapper.get('[data-testid="toggle-theme-btn"]')

    expect(btn.attributes('type')).toBe('button')
    expect(btn.attributes('title')).toBe('Toggles light & dark theme')
    expect(btn.attributes('aria-live')).toBe('polite')
    expect(btn.attributes('aria-label')).toBe('Toggle Light theme')
    wrapper.unmount()
  })

  it('should use "Toggle Dark theme" label when initial html has dark class', () => {
    document.documentElement.classList.add('dark')
    const wrapper = mountCmp()
    const btn = wrapper.get('[data-testid="toggle-theme-btn"]')

    expect(btn.attributes('aria-label')).toBe('Toggle Dark theme')
    wrapper.unmount()
  })

  it('should toggle reactive state and update aria-label on click', async () => {
    const wrapper = mountCmp()
    const btn = wrapper.get('[data-testid="toggle-theme-btn"]')
    expect(btn.attributes('aria-label')).toBe('Toggle Light theme')

    await btn.trigger('click')
    expect(btn.attributes('aria-label')).toBe('Toggle Dark theme')

    await btn.trigger('click')
    expect(btn.attributes('aria-label')).toBe('Toggle Light theme')

    wrapper.unmount()
  })
})
