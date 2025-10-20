import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useNotificationsStore } from './model'

let restoreRandomUUID: (() => void) | null = null

beforeEach(() => {
  setActivePinia(createPinia())
  vi.useFakeTimers()
  const orig = globalThis.crypto
  const hasRnd = orig && typeof orig.randomUUID === 'function'
  let seq = 0
  if (hasRnd) {
    const spy = vi.spyOn(orig, 'randomUUID').mockImplementation(() => {
      ++seq
      return `${seq.toString(16)}-${seq.toString(16)}-${seq.toString(16)}-${seq.toString(16)}-${seq.toString(16)}` as const
    },
    )
    restoreRandomUUID = () => spy.mockRestore()
  }
  else {
    const fake = { ...orig, randomUUID: () => `${seq.toString(16)}-${seq.toString(16)}-${seq.toString(16)}-${seq.toString(16)}-${seq.toString(16)}` as const }
    globalThis.crypto = fake
    restoreRandomUUID = () => {
      globalThis.crypto = orig
    }
  }
})

afterEach(() => {
  vi.useRealTimers()
  if (restoreRandomUUID)
    restoreRandomUUID()
  restoreRandomUUID = null
})

describe('useNotificationsStore', () => {
  it('should push a notification and auto-remove it after default timeout', () => {
    const store = useNotificationsStore()
    store.configure({ autoHideInMs: 100 })
    const id = store.push({ type: 'success', message: 'ok' })

    expect(store.items).toHaveLength(1)
    expect(store.items[0].id).toBe(id)

    vi.advanceTimersByTime(99)
    expect(store.items).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(store.items).toHaveLength(0)
  })

  it('should respect per-notification timeoutMs override', () => {
    const store = useNotificationsStore()
    store.configure({ autoHideInMs: 1000 })
    store.push({ type: 'info', message: 'short', timeoutMs: 50 })

    vi.advanceTimersByTime(49)
    expect(store.items).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(store.items).toHaveLength(0)
  })

  it('should pause and resume auto-hide (hoverPause enabled by default)', () => {
    const store = useNotificationsStore()
    store.configure({ autoHideInMs: 100 })
    const id = store.push({ type: 'warning', message: 'hold' })

    vi.advanceTimersByTime(40)
    store.pause(id)

    vi.advanceTimersByTime(1000)
    expect(store.items).toHaveLength(1)

    store.resume(id)
    vi.advanceTimersByTime(59)
    expect(store.items).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(store.items).toHaveLength(0)
  })

  it('should ignore pause when hoverPause is disabled', () => {
    const store = useNotificationsStore()
    store.configure({ autoHideInMs: 100, hoverPause: false })
    const id = store.push({ type: 'info', message: 'no-pause' })

    vi.advanceTimersByTime(40)
    store.pause(id)

    vi.advanceTimersByTime(60)
    expect(store.items).toHaveLength(0)
  })

  it('should remove a notification immediately and clear its timer', () => {
    const store = useNotificationsStore()
    store.configure({ autoHideInMs: 1000 })
    const id = store.push({ type: 'error', message: 'boom' })
    expect(store.items).toHaveLength(1)

    store.remove(id)
    expect(store.items).toHaveLength(0)

    vi.advanceTimersByTime(2000)
    expect(store.items).toHaveLength(0)
  })

  it('should expose shortcut methods success/error/info/warning', () => {
    const store = useNotificationsStore()
    store.configure({ autoHideInMs: 0 })

    const id1 = store.push({ type: 'success', message: 'ok', title: 't1', timeoutMs: 0 })
    const id2 = store.push({ type: 'error', message: 'boom', title: 't2', timeoutMs: 0 })
    const id3 = store.push({ type: 'info', message: 'note', title: 't3', timeoutMs: 0 })
    const id4 = store.push({ type: 'warning', message: 'warn', title: 't4', timeoutMs: 0 })

    expect(store.items).toHaveLength(4)

    const byId = Object.fromEntries(store.items.map(n => [n.id, n]))
    expect(byId[id1].type).toBe('success')
    expect(byId[id1].message).toBe('ok')
    expect(byId[id1].title).toBe('t1')

    expect(byId[id2].type).toBe('error')
    expect(byId[id3].type).toBe('info')
    expect(byId[id4].type).toBe('warning')
  })

  it('should not schedule auto-hide when default autoHideInMs <= 0', () => {
    const store = useNotificationsStore()
    store.configure({ autoHideInMs: 0 })
    store.push({ type: 'info', message: 'stay' })

    vi.advanceTimersByTime(10_000)
    expect(store.items).toHaveLength(1)
  })

  it('should not schedule auto-hide when timeoutMs <= 0 on the entry', () => {
    const store = useNotificationsStore()
    store.configure({ autoHideInMs: 999 })
    store.push({ type: 'info', message: 'stay2', timeoutMs: 0 })

    vi.advanceTimersByTime(10_000)
    expect(store.items).toHaveLength(1)
  })
})
