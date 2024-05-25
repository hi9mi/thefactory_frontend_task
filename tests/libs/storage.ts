import type { Page } from '@playwright/test'

interface CheckNumberOfItemsInLocalStorageOptions {
  key: string
  page: Page
  expected: number
  defaultValue?: string
}

export async function checkNumberOfItemsInLocalStorage({ key, page, expected, defaultValue = '{}' }: CheckNumberOfItemsInLocalStorageOptions) {
  return await page.waitForFunction(({ _expected, _key, _defaultValue }) => {
    return JSON.parse(localStorage.getItem(_key) || _defaultValue).length === _expected
  }, {
    _expected: expected,
    _key: key,
    _defaultValue: defaultValue,
  })
}
