import { debounce } from '@tf-app/shared/libs/rate-limiters/debounce'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('debounce', () => {
  const mockFn = vi.fn()
  beforeEach(() => {
    vi.useFakeTimers()
    mockFn.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delay function execution', () => {
    const [debouncedFn] = debounce(mockFn, 100)
    debouncedFn()

    expect(mockFn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should only execute the latest call after multiple calls within delay', () => {
    const [debouncedFn] = debounce(mockFn, 50)
    debouncedFn('arg1')
    debouncedFn('arg2')

    vi.advanceTimersByTime(75)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('arg2')
  })

  it('should provide a teardown function to cancel pending execution', () => {
    const [debouncedFn, teardown] = debounce(mockFn, 100)

    debouncedFn()
    teardown()

    vi.advanceTimersByTime(100)

    expect(mockFn).not.toHaveBeenCalled()
  })
})
