import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

vi.mock('magic-grid', () => {
  const instances: any[] = []
  class MagicGridMock {
    gutter: number
    maxColumns?: number
    size: number
    options: any
    positionItems = vi.fn()

    constructor(opts: any) {
      this.options = opts
      this.gutter = opts.gutter
      this.maxColumns = opts.maxColumns
      this.size = opts.items
      instances.push(this)
    }
  }
  return { default: MagicGridMock, __instances: instances }
})

const TfSkeletonStub = { name: 'TfSkeleton', template: '<div data-stub="skeleton"></div>' }

// @ts-expect-error mock
// eslint-disable-next-line
import { __instances as MG_INSTANCES } from 'magic-grid'

// eslint-disable-next-line
import TFMasonryGrid from './tf-masonry-grid.vue'

describe('tf-masonry-grid widget', () => {
  const roInstances: any[] = []
  let cancelSpy: ReturnType<typeof vi.fn>
  let getCS: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    MG_INSTANCES.length = 0
    roInstances.length = 0

    cancelSpy = vi.fn()
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', cancelSpy)

    class RO {
      cb: (entries: any[]) => void
      el: any
      observe = vi.fn((el: any) => { this.el = el })
      disconnect = vi.fn()
      constructor(cb: any) {
        this.cb = cb
        roInstances.push(this)
      }

      trigger(width: number) {
        const entry = { target: this.el, contentRect: { width } }
        this.cb([entry])
      }
    }
    // @ts-expect-error stub global
    globalThis.ResizeObserver = RO

    getCS = vi.spyOn(globalThis, 'getComputedStyle').mockImplementation(() => ({
      getPropertyValue: (prop: string) => {
        if (prop === '--gutter')
          return '24'
        if (prop === '--col-w')
          return '300'
        return ''
      },
    }) as any) as any
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    getCS.mockRestore()
  })

  it('should render skeletons when loading=true', () => {
    const wrapper = mount(TFMasonryGrid, {
      props: { items: [], loading: true, skeletonCount: 5 },
      global: { stubs: { TfSkeleton: TfSkeletonStub } },
    })
    const grid = wrapper.get('[data-testid="gallery-grid"]')
    expect(grid.attributes('aria-busy')).toBe('true')
    expect(wrapper.findAll('[data-stub="skeleton"]').length).toBe(5)
    wrapper.unmount()
  })

  it('should render items and slot when loading=false', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }] as any[]
    const wrapper = mount(TFMasonryGrid, {
      props: {
        items,
        loading: false,
        getAspectRatio: (it: any) => (it.id === 'a' ? 1.5 : undefined),
      },
      slots: {
        default: ({ item }: any) => h('div', { 'class': 'card', 'data-id': item.id }),
      },
      global: { stubs: { TfSkeleton: TfSkeletonStub } },
    })
    expect(wrapper.findAll('.card').length).toBe(3)
    expect(wrapper.find('.card[data-id="a"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should initialize MagicGrid with correct options on mount', async () => {
    const items = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }] as any[]
    const wrapper = mount(TFMasonryGrid, {
      props: { items, loading: false, gutter: 20, maxCols: 6 },
      global: { stubs: { TfSkeleton: TfSkeletonStub } },
      attachTo: document.body,
    })

    await nextTick()
    expect(MG_INSTANCES.length).toBe(1)
    const inst = MG_INSTANCES[0]
    expect(inst.options.container).toBe(wrapper.get('[data-testid="gallery-grid"]').element)
    expect(inst.options.useMin).toBe(true)
    expect(inst.options.gutter).toBe(20)
    expect(inst.options.maxColumns).toBe(6)
    expect(inst.options.items).toBe(5)
    wrapper.unmount()
  })

  it('should recompute cols on ResizeObserver and call positionItems', async () => {
    const wrapper = mount(TFMasonryGrid, {
      props: { items: [{ id: '1' }] as any[], loading: false, maxCols: 8 },
      global: { stubs: { TfSkeleton: TfSkeletonStub } },
      attachTo: document.body,
    })
    await nextTick()

    const inst = MG_INSTANCES[0]
    roInstances[0].trigger(1000)

    expect(inst.maxColumns).toBe(8)
    expect(inst.gutter).toBe(24)
    expect(inst.positionItems).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should update grid.size when items length changes', async () => {
    const wrapper = mount(TFMasonryGrid, {
      props: { items: [{ id: 'x' }] as any[], loading: false },
      global: { stubs: { TfSkeleton: TfSkeletonStub } },
    })
    await nextTick()

    const inst = MG_INSTANCES[0]
    expect(inst.size).toBe(1)

    await wrapper.setProps({ items: [{ id: 'x' }, { id: 'y' }, { id: 'z' }] as any[] })
    await nextTick()
    expect(inst.size).toBe(3)
    expect(inst.positionItems).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should respect loading in size calculation within watcher', async () => {
    const wrapper = mount(TFMasonryGrid, {
      props: { items: [], loading: true, skeletonCount: 7 },
      global: { stubs: { TfSkeleton: TfSkeletonStub } },
    })
    await nextTick()

    const inst = MG_INSTANCES[0]
    expect(inst.size).toBe(7)

    await wrapper.setProps({ items: [{ id: 'a' }] as any[] })
    await nextTick()
    expect(inst.size).toBe(7)

    await wrapper.setProps({ loading: false, items: [{ id: 'a' }, { id: 'b' }] as any[] })
    await nextTick()
    expect(inst.size).toBe(2)
    wrapper.unmount()
  })

  it('should disconnect ResizeObserver and cancel RAF on unmount', async () => {
    const wrapper = mount(TFMasonryGrid, {
      props: { items: [], loading: true },
      global: { stubs: { TfSkeleton: TfSkeletonStub } },
    })
    await nextTick()

    const ro = roInstances[0]
    wrapper.unmount()

    expect(ro.disconnect).toHaveBeenCalledTimes(1)
    expect(cancelSpy).toHaveBeenCalled()
  })
})
