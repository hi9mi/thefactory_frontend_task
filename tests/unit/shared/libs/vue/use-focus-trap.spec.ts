import { useFocusTrap } from '@tf-app/shared/libs/vue/use-focus-trap'
import { createFocusTrap } from 'focus-trap'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Options } from 'focus-trap'

vi.mock('focus-trap', () => ({
  createFocusTrap: vi.fn(),
}))

describe('useFocusTrap', () => {
  const mockFocusTrap = {
    activate: vi.fn(),
    deactivate: vi.fn(),
  }

  beforeEach(() => {
    // @ts-expect-error mock
    createFocusTrap.mockReturnValue(mockFocusTrap)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create and activate focus trap when element provided', async () => {
    const customOptions = undefined
    const { trapRef } = useFocusTrap()

    const element = document.createElement('div')
    trapRef.value = element

    expect(createFocusTrap).toHaveBeenCalledWith(element, customOptions)
    expect(vi.mocked(createFocusTrap).mock.calls[0][0]).toBe(element)
  })

  it('should not create focus trap if element is not provided', async () => {
    const { initFocusTrap } = useFocusTrap()

    initFocusTrap()

    expect(createFocusTrap).not.toHaveBeenCalled()
  })

  it('should call initFocusTrap when element provided', async () => {
    const focusTrap = useFocusTrap()

    const initFocusTrapSpy = vi.spyOn(focusTrap, 'initFocusTrap')
    const element = document.createElement('div')

    focusTrap.trapRef.value = element
    focusTrap.initFocusTrap()

    expect(initFocusTrapSpy).toHaveBeenCalledTimes(1)
    expect(vi.mocked(createFocusTrap).mock.calls.length).toBe(2)
  })

  it('should deactivate focus trap when element removed', async () => {
    const { trapRef, clearFocusTrap } = useFocusTrap()

    const element = document.createElement('div')
    trapRef.value = element

    trapRef.value = null
    clearFocusTrap()

    expect(mockFocusTrap.deactivate).toHaveBeenCalledTimes(1)
  })

  it('should accept custom options for focus trap', async () => {
    const customOptions = {
      clickOutsideDeactivates: false,
    } satisfies Options

    const { trapRef } = useFocusTrap(customOptions)

    const element = document.createElement('div')
    trapRef.value = element

    expect(createFocusTrap).toHaveBeenCalledWith(element, customOptions)
  })
})
