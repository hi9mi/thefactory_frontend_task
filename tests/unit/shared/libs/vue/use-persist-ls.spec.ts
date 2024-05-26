import { nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getItemFromLS, setItemToLS } from '@tf-app/shared/libs/storage/local'
import { usePersistLS } from '@tf-app/shared/libs/vue/use-persist-ls'

vi.mock('@tf-app/shared/libs/storage/local', () => ({
  getItemFromLS: vi.fn(),
  setItemToLS: vi.fn(),
}))

describe('usePersistLS', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return value from localStorage for existing key (sync: false)', () => {
    const key = 'test_key'
    const valueFromLS = 'persisted_value'

    vi.mocked(getItemFromLS).mockReturnValue(valueFromLS)

    const data = usePersistLS(ref(null), key)

    expect(data.value).toBe(valueFromLS)
  })

  it('should return default value if key does not exist in localStorage (sync: false)', () => {
    const key = 'test_key'
    const defaultValue = 'default_value'

    vi.mocked(getItemFromLS).mockReturnValue(defaultValue)

    const data = usePersistLS(ref(defaultValue), key)

    expect(data.value).toBe(defaultValue)
  })

  it('should save data to localStorage on change (sync: false)', async () => {
    const key = 'test_key'
    const newValue = 'new_value'

    const data = usePersistLS(ref('initial_value'), key)

    data.value = newValue

    await nextTick()

    expect(vi.mocked(setItemToLS)).toHaveBeenCalledWith(key, newValue)
  })

  it('should update value from localStorage events (sync: true)', () => {
    const key = 'test_key'
    const newValueFromLS = 'updated_value'

    const data = usePersistLS(ref(null), key, true)

    const storageEvent = new StorageEvent('storage', {
      storageArea: globalThis.localStorage,
      key,
      newValue: JSON.stringify(newValueFromLS),
    })

    window.dispatchEvent(storageEvent)

    expect(data.value).toBe(newValueFromLS)
  })

  it('should not listen to storage events when sync: false', () => {
    const key = 'test_key'
    vi.mocked(getItemFromLS).mockReturnValue(null)
    const data = usePersistLS(ref(null), key)

    const storageEvent = new StorageEvent('storage', {
      storageArea: globalThis.localStorage,
      key,
      newValue: JSON.stringify('updated_value'),
    })
    window.dispatchEvent(storageEvent)

    expect(data.value).toBeNull()
  })

  it ('should properly handle non-serializable data)', () => {
    const key = 'test_key'
    const value = {
      foo: () => {},
      bar: new Map([['key', 'value']]),
      baz: new Set([1, 2, 3]),
      qux: new Date('2022-01-01'),
      quux: new Error('Error message'),
      corge: new Uint8Array([1, 2, 3]),
      grault: new ArrayBuffer(8),
      waldo: new WeakMap(),
      plugh: new WeakSet(),
      xyzzy: new Proxy({}, {}),
    }

    vi.mocked(getItemFromLS).mockReturnValue(JSON.stringify(value))
    const data = usePersistLS<any>(ref(null), key)

    data.value = value

    expect(getItemFromLS(key, null)).toEqual(JSON.stringify(value))
  })

  it('should handle errors if setItemToLS throws', () => {
    const key = 'test_key'
    const value = 'new_value'
    const consoleErrorSpy = vi.spyOn(console, 'error')
    vi.mocked(setItemToLS).mockImplementation(() => {
      throw new Error('Test error')
    })

    usePersistLS(ref(value), key)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to persist data to localStorage:', new Error('Test error'))
  })
})
