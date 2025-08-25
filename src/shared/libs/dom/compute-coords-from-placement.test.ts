import { describe, expect, it } from 'vitest'
import { adjustPositionWithinViewport, computeCommonX, computeCommonY, computeCoordsFromPlacement } from './compute-coords-from-placement'

interface R { x: number, y: number, width: number, height: number }
const rect = (x: number, y: number, w: number, h: number): R => ({ x, y, width: w, height: h })

/** Stable viewport/scroll setup for jsdom */
function setViewport({ width, height, scrollX = 0, scrollY = 0 }: { width: number, height: number, scrollX?: number, scrollY?: number }) {
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, get: () => width })
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, get: () => height })
  const _sx = scrollX
  const _sy = scrollY
  Object.defineProperty(window, 'scrollX', { configurable: true, get: () => _sx })
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => _sy })
  // expose globals for code paths that use bare scrollX/scrollY
  Object.defineProperty(globalThis as any, 'scrollX', { configurable: true, get: () => _sx })
  Object.defineProperty(globalThis as any, 'scrollY', { configurable: true, get: () => _sy })
}

describe('compute-coords-from-placement: core math', () => {
  it('should compute common X/Y centers correctly', () => {
    const a = rect(100, 200, 50, 20)
    const f = rect(0, 0, 30, 10)
    expect(computeCommonX(a as any, f as any)).toBe(110)
    expect(computeCommonY(a as any, f as any)).toBe(205)
  })
})

describe('compute-coords-from-placement: placements', () => {
  it('should compute "top" placement with default offset and include scroll', () => {
    setViewport({ width: 800, height: 600, scrollX: 10, scrollY: 20 })
    const anchor = rect(100, 200, 50, 20)
    const floating = rect(0, 0, 30, 10)

    const pos = computeCoordsFromPlacement({ anchorRect: anchor as any, floatRect: floating as any }, 'top')
    expect(pos).toEqual({ x: 120, y: 200 })
  })

  it('should throw on invalid placement', () => {
    setViewport({ width: 800, height: 600 })
    const anchor = rect(0, 0, 10, 10)
    const floating = rect(0, 0, 5, 5)
    // @ts-expect-error invalid on purpose
    expect(() => computeCoordsFromPlacement({ anchorRect: anchor as any, floatRect: floating as any }, 'nope')).toThrow(/invalid placement/i)
  })
})

describe('compute-coords-from-placement: viewport clamping', () => {
  it('should clamp negative coords to current scroll (left/top bounds)', () => {
    setViewport({ width: 800, height: 600, scrollX: 0, scrollY: 0 })

    const anchor = rect(5, 5, 20, 20)
    const floating = rect(0, 0, 50, 40)

    const posLeft = computeCoordsFromPlacement({ anchorRect: anchor as any, floatRect: floating as any }, 'left-start', 10)
    expect(posLeft.x).toBe(0)

    const posTop = computeCoordsFromPlacement({ anchorRect: anchor as any, floatRect: floating as any }, 'top-start', 10)
    expect(posTop.y).toBe(0)
  })

  it('should clamp right/bottom coords within viewport (page coordinates)', () => {
    setViewport({ width: 200, height: 100, scrollX: 50, scrollY: 30 })

    const anchor = rect(220, 150, 60, 60)
    const floating = rect(0, 0, 40, 50)

    const posRight = computeCoordsFromPlacement({ anchorRect: anchor as any, floatRect: floating as any }, 'right', 10)
    expect(posRight.x).toBe(210)

    const posBottom = computeCoordsFromPlacement({ anchorRect: anchor as any, floatRect: floating as any }, 'bottom', 10)
    expect(posBottom.y).toBe(80)
  })
})

describe('adjustPositionWithinViewport (direct)', () => {
  it('should be idempotent when coords are already within viewport', () => {
    setViewport({ width: 800, height: 600, scrollX: 10, scrollY: 20 })
    const flo = rect(0, 0, 100, 80)
    const coords = { x: 200, y: 300 }
    const adjusted = adjustPositionWithinViewport({ ...coords }, flo as any)
    expect(adjusted).toEqual(coords)
  })
})
