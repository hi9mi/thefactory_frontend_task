import { computeRelativeBrightness } from '@tf-app/shared/libs'

import { describe, expect, it } from 'vitest'

describe('computeRelativeBrightness', () => {
  it('should return 255 for white color', () => {
    expect(computeRelativeBrightness(255, 255, 255)).toBe(255)
  })

  it('should return 0 for black color', () => {
    expect(computeRelativeBrightness(0, 0, 0)).toBe(0)
  })

  it('should return correct brightness for red color', () => {
    expect(computeRelativeBrightness(255, 0, 0)).toBeCloseTo(76.245)
  })

  it('should return correct brightness for green color', () => {
    expect(computeRelativeBrightness(0, 255, 0)).toBeCloseTo(149.685)
  })

  it('should return correct brightness for blue color', () => {
    expect(computeRelativeBrightness(0, 0, 255)).toBeCloseTo(29.07)
  })

  it('should return correct brightness for a random color', () => {
    expect(computeRelativeBrightness(38, 64, 64)).toBeCloseTo(56.226)
  })

  it('should return correct brightness for another random color', () => {
    expect(computeRelativeBrightness(100, 150, 200)).toBeCloseTo(140.75)
  })

  it('should return correct brightness for boundary value', () => {
    expect(computeRelativeBrightness(127, 127, 127)).toBeCloseTo(127)
  })
})
