import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ElementRects, Placement } from './compute-coords-from-placement'
import { addScroll, adjustPositionWithinViewport, computeCommonX, computeCommonY, computeCoordsFromPlacement } from './compute-coords-from-placement'

describe('computeCoordsFromPlacement', () => {
  const mockAnchorRect: DOMRect = {
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    bottom: 200,
    left: 100,
    right: 300,
    top: 100,
    toJSON: () => {},
  } as DOMRect

  const mockFloatRect: DOMRect = {
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    bottom: 50,
    left: 0,
    right: 100,
    top: 0,
    toJSON: () => {},
  } as DOMRect

  const elementRects: ElementRects = {
    anchorRect: mockAnchorRect,
    floatRect: mockFloatRect,
  }

  beforeEach(() => {
    vi.stubGlobal('window', {
      scrollX: 0,
      scrollY: 0,
    })
    vi.stubGlobal('document', {
      documentElement: {
        clientWidth: 1024,
        clientHeight: 768,
      },
    })
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  it.each<Placement>([
    'bottom',
    'right',
    'left',
    'top',
    'bottom-end',
    'bottom-start',
    'left-end',
    'left-start',
    'right-end',
    'right-start',
    'top-end',
    'top-start',
  ])('should compute coordinates for %s placement correctly', (placement) => {
    const coords = computeCoordsFromPlacement(elementRects, placement)

    expect(coords).toBeDefined()
    expect(coords.x).toBeGreaterThanOrEqual(0)
    expect(coords.y).toBeGreaterThanOrEqual(0)
  })

  it('should throw an error for invalid placement', () => {
    // @ts-expect-error Test invalid placement
    expect(() => computeCoordsFromPlacement(elementRects, 'invalid-placement')).toThrow('Invalid placement: invalid-placement')
  })

  it('should adjust coordinates for elements going out of viewport bounds', () => {
    const coords = computeCoordsFromPlacement(elementRects, 'top', 1000)

    expect(coords.y).toBeGreaterThanOrEqual(0)
  })

  it.each([0, 10, 20])('should correctly compute coordinates with offset %i', (offset) => {
    const coords = computeCoordsFromPlacement(elementRects, 'bottom', offset)

    expect(coords.y).toBe(mockAnchorRect.y + mockAnchorRect.height + offset)
  })

  it('should add scroll values to the computed coordinates', () => {
    vi.stubGlobal('window', {
      scrollX: 50,
      scrollY: 60,
    })

    const coords = computeCoordsFromPlacement(elementRects, 'bottom')

    expect(coords.x).toBeGreaterThanOrEqual(window.scrollX)
    expect(coords.y).toBeGreaterThanOrEqual(window.scrollY)
  })

  it('should adapt coordinates to browser window resizing', () => {
    vi.stubGlobal('document', {
      documentElement: {
        clientWidth: 800,
        clientHeight: 600,
      },
    })

    const coords = computeCoordsFromPlacement(elementRects, 'right')

    expect(coords.x).toBeLessThanOrEqual(800)
    expect(coords.y).toBeLessThanOrEqual(600)
  })

  describe('addScroll', () => {
    it('should add window scroll values to coordinates', () => {
      vi.stubGlobal('window', {
        scrollX: 5,
        scrollY: 15,
      })
      const coords = { x: 10, y: 20 }
      const expected = { x: 15, y: 35 }

      const result = addScroll(coords)

      expect(result).toEqual(expected)
    })
  })

  describe('computeCommonX', () => {
    it('should compute common X coordinate based on anchor and float rects', () => {
      const anchorRect = new DOMRect(100, 100, 200, 100)
      const floatRect = new DOMRect(0, 0, 100, 50)
      const expected = 150

      const result = computeCommonX(anchorRect, floatRect)

      expect(result).toBe(expected)
    })
  })

  describe('computeCommonY', () => {
    it('should compute common Y coordinate based on anchor and float rects', () => {
      const anchorRect = new DOMRect(100, 100, 200, 100)
      const floatRect = new DOMRect(0, 0, 100, 50)
      const expected = 125

      const result = computeCommonY(anchorRect, floatRect)

      expect(result).toBe(expected)
    })
  })

  describe('adjustPositionWithinViewport', () => {
    it('should adjust position within the viewport', () => {
      const coords = { x: 950, y: 700 }
      const floatRect = new DOMRect(0, 0, 100, 50)
      const expected = { x: 924, y: 718 }

      const result = adjustPositionWithinViewport(coords, floatRect)

      expect(result.x).toBeLessThanOrEqual(expected.x)
      expect(result.y).toBeLessThanOrEqual(expected.y)
    })

    it('should not adjust position if already within the viewport', () => {
      const coords = { x: 400, y: 300 }
      const floatRect = new DOMRect(0, 0, 100, 50)

      const result = adjustPositionWithinViewport(coords, floatRect)

      expect(result).toEqual(coords)
    })
  })
})
