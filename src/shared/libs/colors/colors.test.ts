import { describe, expect, it } from 'vitest'
import { computeRelativeBrightness } from './compute-relative-brightness'
import { hexToRgb } from './hex-to-rgb'

describe('colors utils: hexToRgb', () => {
  it('should parse 6-digit hex with leading #', () => {
    const rgb = hexToRgb('#aabbcc')
    expect(rgb).toEqual({ r: 170, g: 187, b: 204 })
  })

  it('should parse 6-digit hex without leading #', () => {
    const rgb = hexToRgb('112233')
    expect(rgb).toEqual({ r: 17, g: 34, b: 51 })
  })

  it('should parse 3-digit shorthand and expand to 6-digit', () => {
    const rgb = hexToRgb('#abc') // -> aabbcc
    expect(rgb).toEqual({ r: 170, g: 187, b: 204 })
  })

  it('should be case-insensitive for hex letters', () => {
    const lower = hexToRgb('#ff00aa')
    const upper = hexToRgb('#FF00AA')
    expect(lower).toEqual({ r: 255, g: 0, b: 170 })
    expect(upper).toEqual(lower)
  })

  it('should return zeros for invalid hex strings (bad length/characters)', () => {
    expect(hexToRgb('zzzzzz')).toEqual({ r: 0, g: 0, b: 0 }) // invalid chars
    expect(hexToRgb('abcd')).toEqual({ r: 0, g: 0, b: 0 }) // invalid length
    expect(hexToRgb('##fff')).toEqual({ r: 0, g: 0, b: 0 }) // extra '#'
    expect(hexToRgb('#12')).toEqual({ r: 0, g: 0, b: 0 }) // too short
  })

  it('should handle edge colors black and white', () => {
    expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
  })
})

describe('colors utils: computeRelativeBrightness', () => {
  it('should be 0 for black', () => {
    expect(computeRelativeBrightness(0, 0, 0)).toBe(0)
  })

  it('should be 255 for white', () => {
    expect(computeRelativeBrightness(255, 255, 255)).toBeCloseTo(255, 6)
  })

  it('should compute standard luminance for primary colors', () => {
    expect(computeRelativeBrightness(255, 0, 0)).toBeCloseTo(76.245, 3) // red
    expect(computeRelativeBrightness(0, 255, 0)).toBeCloseTo(149.685, 3) // green
    expect(computeRelativeBrightness(0, 0, 255)).toBeCloseTo(29.07, 3) // blue
  })

  it('should increase with brighter channels (sanity check)', () => {
    const dark = hexToRgb('#111')
    const bright = hexToRgb('#aaa')
    const darkY = computeRelativeBrightness(dark.r, dark.g, dark.b)
    const brightY = computeRelativeBrightness(bright.r, bright.g, bright.b)
    expect(brightY).toBeGreaterThan(darkY)
  })

  it('should match expected brightness for a known color (#aabbcc)', () => {
    const { r, g, b } = hexToRgb('#aabbcc') // 170,187,204
    const y = computeRelativeBrightness(r, g, b)
    // 0.299*170 + 0.587*187 + 0.114*204 = 183.855
    expect(y).toBeCloseTo(183.855, 3)
  })
})
