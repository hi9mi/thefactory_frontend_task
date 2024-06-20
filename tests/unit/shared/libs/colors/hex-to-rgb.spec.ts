import { describe, expect, it } from 'vitest'

import { hexToRgb } from '@tf-app/shared/libs'

describe('hexToRgb', () => {
  it('should return correct rgb values for hex color #000000', () => {
    const rgb = hexToRgb('#000000')
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('should return correct rgb values for hex color #ffffff', () => {
    const rgb = hexToRgb('#ffffff')
    expect(rgb).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('should return correct rgb values for hex color #000', () => {
    const rgb = hexToRgb('#000')
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('should return correct rgb values for hex color #fff', () => {
    const rgb = hexToRgb('#fff')
    expect(rgb).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('should return correct rgb values for hex color #ff00ff', () => {
    const rgb = hexToRgb('#ff00ff')
    expect(rgb).toEqual({ r: 255, g: 0, b: 255 })
  })

  it('should return undefined for non-hex color', () => {
    const rgb = hexToRgb('not a hex color')
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('should return undefined for hex color with wrong length', () => {
    const rgb = hexToRgb('#12345')
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('should return undefined for hex color with wrong format', () => {
    const rgb = hexToRgb('#abcdefg')
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 })
  })
})
