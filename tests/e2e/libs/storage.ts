import type { Page } from '@playwright/test'

interface CheckNumberOfItemsInLocalStorageOptions {
  key: string
  page: Page
  expected: number
  defaultValue?: string
}

export async function checkNumberOfItemsInLocalStorage({ key, page, expected, defaultValue = '{}' }: CheckNumberOfItemsInLocalStorageOptions) {
  return await page.waitForFunction(({ _expected, _key, _defaultValue }) => {
    return JSON.parse(localStorage.getItem(_key) ?? _defaultValue).length === _expected
  }, {
    _expected: expected,
    _key: key,
    _defaultValue: defaultValue,
  })
}

interface SimulateStorageEventOptions {
  page: Page
  key: string
  oldValue: string | null
  newValue: string
}

export async function simulateLocalStorageEvent({ page, key, oldValue, newValue }: SimulateStorageEventOptions) {
  await page.evaluate(({ _key, _oldValue, _newValue }) => {
    const event = new StorageEvent('storage', {
      key: _key,
      newValue: _newValue,
      oldValue: _oldValue,
      storageArea: globalThis.localStorage,
    })

    window.dispatchEvent(event)
  }, {
    _key: key,
    _newValue: newValue,
    _oldValue: oldValue,
  })
}
