import type { ObjectDirective, VNode } from 'vue'

import type { LazyImageOptions } from './libs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLazyImage } from './libs'

interface IOEntry { isIntersecting: boolean, target: Element }

let OriginalIO: any
let OriginalImage: any

class FakeIntersectionObserver {
  callback: (entries: IOEntry[], observer: FakeIntersectionObserver) => void
  options: IntersectionObserverInit | undefined
  observed: Element[] = []
  disconnect = vi.fn()
  constructor(cb: any, opts?: IntersectionObserverInit) {
    this.callback = cb
    this.options = opts
    FakeIntersectionObserver.last = this
  }

  observe = (el: Element) => {
    this.observed.push(el)
  }

  triggerIntersect(entry: IOEntry) {
    this.callback([entry], this)
  }

  static last: FakeIntersectionObserver | null = null
}

class FakeImage {
  src = ''
  srcset = ''
  sizes = ''
  onload: ((ev?: Event) => any) | null = null
  onerror: ((ev?: Event) => any) | null = null
  constructor() {
    ;(globalThis as any).__lastImage = this
  }

  _triggerLoad() { this.onload?.(new Event('load')) }
  _triggerError() { this.onerror?.(new Event('error')) }
}

function callMounted(
  dir: ObjectDirective<HTMLImageElement, LazyImageOptions>,
  el: HTMLImageElement,
  value: LazyImageOptions,
) {
  const binding = { value } as any
  const vnode = {} as VNode<any, HTMLImageElement>
  const prev = null as any
  dir.mounted?.(el, binding, vnode, prev)
}

beforeEach(() => {
  OriginalIO = (globalThis as any).IntersectionObserver
  OriginalImage = (globalThis as any).Image
  ;(globalThis as any).IntersectionObserver = FakeIntersectionObserver
  ;(globalThis as any).Image = FakeImage
  FakeIntersectionObserver.last = null
})

afterEach(() => {
  ;(globalThis as any).IntersectionObserver = OriginalIO
  ;(globalThis as any).Image = OriginalImage
  vi.restoreAllMocks()
})

describe('useLazyImage / vLazy', () => {
  it('should not start loading until the element intersects', () => {
    const { vLazy, state } = useLazyImage()
    const el = document.createElement('img')
    const onLoad = vi.fn()
    const onError = vi.fn()
    const onIntersect = vi.fn()

    callMounted(vLazy, el, {
      originalSrc: 'https://ex/img.jpg',
      placeholderSrc: 'data:image/gif;base64,AAA',
      onLoad,
      onError,
      onIntersect,
    })

    expect(state.isLoading).toBe(false)
    expect(el.getAttribute('src')).toBeNull()
    expect(onLoad).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onIntersect).not.toHaveBeenCalled()
  })

  it('should start loading on intersect, set placeholder, and call onIntersect', () => {
    const { vLazy, state } = useLazyImage()
    const el = document.createElement('img')
    const onLoad = vi.fn()
    const onError = vi.fn()
    const onIntersect = vi.fn()

    callMounted(vLazy, el, {
      originalSrc: 'https://ex/full.jpg',
      placeholderSrc: 'data:image/png;base64,PLACE',
      onLoad,
      onError,
      onIntersect,
    })

    const io = FakeIntersectionObserver.last!
    io.triggerIntersect({ isIntersecting: true, target: el })

    expect(state.isLoading).toBe(true)
    expect(el.src).toContain('data:image/png;base64,PLACE')
    expect(onIntersect).toHaveBeenCalledWith(el)
    expect(io.disconnect).toHaveBeenCalledTimes(1)
  })

  it('should swap to original image on load, copy srcset/sizes, set alt, and call onLoad', () => {
    const { vLazy, state } = useLazyImage()
    const el = document.createElement('img')
    const onLoad = vi.fn()
    const onError = vi.fn()
    const onIntersect = vi.fn()

    const originalSrc = 'https://ex/full.jpg'
    const srcset = 'https://ex/1x.jpg 1x, https://ex/2x.jpg 2x'
    const sizes = '(max-width: 600px) 100vw, 600px'
    const alt = 'Hello'

    callMounted(vLazy, el, {
      originalSrc,
      placeholderSrc: 'data:image/gif;base64,AAA',
      srcset,
      sizes,
      alt,
      onLoad,
      onError,
      onIntersect,
    })

    FakeIntersectionObserver.last!.triggerIntersect({ isIntersecting: true, target: el })

    const inst = (globalThis as any).__lastImage as FakeImage
    inst.src = originalSrc
    inst.srcset = srcset
    inst.sizes = sizes
    inst._triggerLoad()

    expect(state.isLoading).toBe(false)
    expect(state.isError).toBe(false)
    expect(el.src).toBe(originalSrc)
    expect(el.srcset).toBe(srcset)
    expect(el.sizes).toBe(sizes)
    expect(el.alt).toBe(alt)
    expect(onLoad).toHaveBeenCalledWith(el)
    expect(onError).not.toHaveBeenCalled()
  })

  it('should set error state and call onError when preload fails', () => {
    const { vLazy, state } = useLazyImage()
    const el = document.createElement('img')
    const onLoad = vi.fn()
    const onError = vi.fn()
    const onIntersect = vi.fn()

    callMounted(vLazy, el, {
      originalSrc: 'https://ex/full.jpg',
      placeholderSrc: 'data:image/gif;base64,AAA',
      onLoad,
      onError,
      onIntersect,
    })

    FakeIntersectionObserver.last!.triggerIntersect({ isIntersecting: true, target: el })

    const inst = (globalThis as any).__lastImage as FakeImage
    inst._triggerError()

    expect(state.isLoading).toBe(false)
    expect(state.isError).toBe(true)
    expect(onError).toHaveBeenCalledWith(el)
    expect(onLoad).not.toHaveBeenCalled()
  })

  it('should pass intersectionOptions to IntersectionObserver', () => {
    const { vLazy } = useLazyImage()
    const el = document.createElement('img')
    const opts: IntersectionObserverInit = { rootMargin: '12px', threshold: 0.5 }
    const onLoad = vi.fn()
    const onError = vi.fn()
    const onIntersect = vi.fn()

    callMounted(vLazy, el, {
      originalSrc: 'https://ex/full.jpg',
      placeholderSrc: 'data:image/gif;base64,AAA',
      intersectionOptions: opts,
      onLoad,
      onError,
      onIntersect,
    })

    const io = FakeIntersectionObserver.last!
    expect(io.options).toEqual(opts)
  })
})
