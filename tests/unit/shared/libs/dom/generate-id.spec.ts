import { generateId } from '@tf-app/shared/libs/dom/generate-id'

import { describe, expect, it } from 'vitest'

describe('generateId', () => {
  it('should generate id with prefix "id" and suffix ""', () => {
    const id = generateId()
    expect(id).toMatch(/^id-\d+$/)
  })

  it('should generate unique ids', () => {
    const ids = [generateId(), generateId(), generateId()]
    expect(ids.length).toBe(ids.filter((id, i) => ids.indexOf(id) === i).length)
  })

  it('should generate id with prefix "custom" and suffix "-suffix"', () => {
    const customId = generateId('custom', '-suffix')
    expect(customId).toMatch(/^custom-\d+-suffix$/)
  })
})
