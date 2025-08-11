import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'
export interface Notification {
  id: string
  type: NotificationType
  message: string
  title?: string
  timeoutMs?: number
}

interface TimerState { tid: ReturnType<typeof setTimeout> | null, remaining: number, started: number }

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<Notification[]>([])
  const timers = new Map<string, TimerState>()
  const defaults = ref({ autoHideInMs: 3500, hoverPause: true })

  function configure(opts: Partial<typeof defaults.value>) {
    Object.assign(defaults.value, opts)
  }

  function schedule(id: string, timeoutMs?: number) {
    const ms = timeoutMs ?? defaults.value.autoHideInMs
    if (!ms || ms <= 0)
      return
    clear(id)
    const started = Date.now()
    const tid = setTimeout(() => remove(id), ms)
    timers.set(id, { tid, remaining: ms, started })
  }

  function clear(id: string) {
    const t = timers.get(id)
    if (t?.tid)
      clearTimeout(t.tid)
    timers.delete(id)
  }

  function pause(id: string) {
    if (!defaults.value.hoverPause)
      return
    const t = timers.get(id)
    if (!t?.tid)
      return
    clearTimeout(t.tid)
    const elapsed = Date.now() - t.started
    timers.set(id, { tid: null, remaining: Math.max(0, t.remaining - elapsed), started: 0 })
  }

  function resume(id: string) {
    const t = timers.get(id)
    if (!t || t.remaining <= 0)
      return
    const started = Date.now()
    const tid = setTimeout(() => remove(id), t.remaining)
    timers.set(id, { tid, remaining: t.remaining, started })
  }

  function push(toast: Omit<Notification, 'id'>) {
    const id = crypto.randomUUID()
    const entry: Notification = { id, ...toast }
    items.value.push(entry)
    schedule(id, entry.timeoutMs)
    return id
  }

  function remove(id: string) {
    const i = items.value.findIndex(x => x.id === id)
    if (i !== -1)
      items.value.splice(i, 1)
    clear(id)
  }

  // shortcuts
  const success = (m: string, t?: string, time?: number) => push({ type: 'success', message: m, title: t, timeoutMs: time })
  const error = (m: string, t?: string, time?: number) => push({ type: 'error', message: m, title: t, timeoutMs: time })
  const info = (m: string, t?: string, time?: number) => push({ type: 'info', message: m, title: t, timeoutMs: time })
  const warning = (m: string, t?: string, time?: number) => push({ type: 'warning', message: m, title: t, timeoutMs: time })

  return { items, configure, push, remove, pause, resume, success, error, info, warning }
})
