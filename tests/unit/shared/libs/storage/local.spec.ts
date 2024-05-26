import { describe, expect, it } from 'vitest'

import { getItemFromLS, setItemToLS } from '@tf-app/shared/libs/storage/local'

describe('getItemFromLS', () => {
  it('should return default value for non-existent key', () => {
    const key = 'test_key'
    const defaultValue = 'default'

    expect(getItemFromLS(key, defaultValue)).toBe(defaultValue)
  })

  it('should return parsed JSON data for existing key', () => {
    const key = 'test_key'
    const value = { data: 'value' }

    localStorage.setItem(key, JSON.stringify(value))

    expect(getItemFromLS(key, null)).toEqual(value)

    localStorage.clear()
  })
})

describe('setItemToLS', () => {
  it('should set the value in localStorage as JSON string', () => {
    const key = 'test_key'
    const value = { data: 'value' }

    setItemToLS(key, value)

    expect(localStorage.getItem(key)).toBe(JSON.stringify(value))

    localStorage.clear()
  })
})
