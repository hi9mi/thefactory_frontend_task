import type { Page } from '@playwright/test'

interface CheckNumberOfItemsInLocalStorageOptions {
  key: string
  page: Page
  expected: number
  defaultValue?: string
}

export async function checkNumberOfItemsInLocalStorage({
  key,
  page,
  expected,
  defaultValue = '{}',
}: CheckNumberOfItemsInLocalStorageOptions) {
  await page.waitForFunction(
    ({ _key, _expected, _defaultValue }) => {
      const raw = localStorage.getItem(_key)
      const len = (() => {
        try {
          const parsed = JSON.parse(raw ?? _defaultValue)
          if (Array.isArray(parsed))
            return parsed.length
          if (parsed && typeof parsed === 'object' && 'length' in parsed) {
            const n = (parsed as any).length
            return typeof n === 'number' ? n : 0
          }
          return 0
        }
        catch {
          return 0
        }
      })()
      return len === _expected
    },
    { _key: key, _expected: expected, _defaultValue: defaultValue },
    { timeout: 10_000 },
  )
}

interface SimulateStorageEventOptions {
  page: Page
  key: string
  oldValue: string | null
  newValue: string
  dispatchEvent?: boolean
}

export async function simulateLocalStorageEvent({
  page,
  key,
  oldValue,
  newValue,
  dispatchEvent = true,
}: SimulateStorageEventOptions) {
  await page.evaluate(({ _key, _newValue, _dispatchEvent }) => {
    const prev = localStorage.getItem(_key)
    localStorage.setItem(_key, _newValue)

    if (_dispatchEvent) {
      const ev = new StorageEvent('storage', {
        key: _key,
        oldValue: prev,
        newValue: _newValue,
        storageArea: localStorage,
        url: location.href,
      })
      window.dispatchEvent(ev)
    }
  }, { _key: key, _oldValue: oldValue, _newValue: newValue, _dispatchEvent: dispatchEvent })
}
