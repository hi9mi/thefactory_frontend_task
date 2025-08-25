import { afterEach, describe, expect, it, vi } from 'vitest'
import { debounce } from './debounce'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('debounce', () => {
  it('should call the function once after the delay with the latest arguments', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const [debounced] = debounce(spy, 100)

    debounced('a')
    vi.advanceTimersByTime(50)
    debounced('b')

    expect(spy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(99)
    expect(spy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('b')
  })

  it('should preserve the original "this" context', () => {
    vi.useFakeTimers()
    const obj1 = { value: 0 }
    function setValue(this: typeof obj1, v: number) {
      this.value = v
    }
    const [debounced] = debounce(setValue, 10)

    debounced.call(obj1, 42)
    vi.advanceTimersByTime(10)

    expect(obj1.value).toBe(42)
  })

  it('should use the latest call\'s context and args when rapidly invoked', () => {
    vi.useFakeTimers()
    const objA = { value: 0 }
    const objB = { value: 0 }
    function setValue(this: any, v: number) {
      this.value = v
    }
    const [debounced] = debounce(setValue, 20)

    debounced.call(objA, 1)
    vi.advanceTimersByTime(10)
    debounced.call(objB, 2)

    vi.advanceTimersByTime(20)
    expect(objA.value).toBe(0)
    expect(objB.value).toBe(2)
  })

  it('should cancel the pending call when teardown is invoked', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const [debounced, teardown] = debounce(spy, 50)

    debounced('x')
    teardown()
    vi.advanceTimersByTime(100)

    expect(spy).not.toHaveBeenCalled()
  })

  it('should work again after teardown is called', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const [debounced, teardown] = debounce(spy, 30)

    debounced('first')
    teardown()
    debounced('second')
    vi.advanceTimersByTime(30)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('second')
  })

  it('should not throw when teardown is called multiple times', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const [debounced, teardown] = debounce(spy, 10)

    debounced('a')
    teardown()
    expect(() => teardown()).not.toThrow()
    vi.advanceTimersByTime(20)
    expect(spy).not.toHaveBeenCalled()
  })

  it('should respect a custom delay (ms)', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const [debounced] = debounce(spy, 5)

    debounced('z')
    vi.advanceTimersByTime(4)
    expect(spy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('z')
  })
})
