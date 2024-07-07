import { ref, watchEffect } from 'vue'
import { mount } from '@vue/test-utils'
import { useDark, useToggle } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ToggleTheme from '@tf-app/features/toggle-theme/toggle-theme.vue'

vi.mock('@vueuse/core', () => ({
  useDark: vi.fn(),
  useToggle: vi.fn(),
}))
describe('toggleTheme', () => {
  let wrapper: ReturnType<typeof mount<typeof ToggleTheme>>

  beforeEach(() => {
    const isDarkTheme = ref(false)
    // @ts-expect-error mock
    useDark.mockImplementation(() => {
      watchEffect(() => {
        if (isDarkTheme.value) {
          document.documentElement.classList.add('dark')
          document.documentElement.classList.remove('light')
        }
        else {
          document.documentElement.classList.add('light')
          document.documentElement.classList.remove('dark')
        }
      })

      return isDarkTheme
    })
    // @ts-expect-error mock
    useToggle.mockImplementation(() => () => {
      isDarkTheme.value = !isDarkTheme.value
      return isDarkTheme.value
    })
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
    // @ts-expect-error cleanup wrapper
    wrapper = undefined
  })

  it('should renders button witch correct aria-label based on theme', async () => {
    wrapper = mount(ToggleTheme)

    const button = wrapper.find('#toggle-theme-btn')
    expect(button.attributes('aria-label')).toBe('Toggle Light theme')

    await button.trigger('click')
    expect(button.attributes('aria-label')).toBe('Toggle Dark theme')
  })

  it('should apply correct classes based on theme', async () => {
    wrapper = mount(ToggleTheme)

    const button = wrapper.find('#toggle-theme-btn')
    expect(button.classes()).toContain('button')

    await button.trigger('click')
    expect(button.classes()).toContain('button')
    expect(document.documentElement.classList).toContain('dark')
  })

  it('should toggle theme multiple times correctly', async () => {
    wrapper = mount(ToggleTheme)

    const button = wrapper.find('#toggle-theme-btn')

    await button.trigger('click')
    expect(button.attributes('aria-label')).toBe('Toggle Dark theme')

    await button.trigger('click')
    expect(button.attributes('aria-label')).toBe('Toggle Light theme')

    await button.trigger('click')
    expect(button.attributes('aria-label')).toBe('Toggle Dark theme')
  })

  it('should call useToggle and useDark correctly', async () => {
    wrapper = mount(ToggleTheme)

    const button = wrapper.find('#toggle-theme-btn')

    await button.trigger('click')
    expect(useToggle).toHaveBeenCalled()
    expect(useDark).toHaveBeenCalled()
  })

  it('should have correct accessibility attributes', () => {
    wrapper = mount(ToggleTheme)

    const button = wrapper.find('#toggle-theme-btn')
    expect(button.attributes('aria-live')).toBe('polite')
    expect(button.attributes('title')).toBe('Toggles light & dark theme')
  })
})
