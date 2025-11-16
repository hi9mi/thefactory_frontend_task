import type { Pinia } from 'pinia'
import { token } from 'ditox'
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

interface TimerState { timerId: ReturnType<typeof setTimeout> | null, remainingMs: number, started: number }

export const useNotificationsStore = defineStore('notifications', () => {
  const notificationsList = ref<Notification[]>([])
  const timers = new Map<string, TimerState>()
  const defaults = ref({ autoHideInMs: 3500, hoverPause: true })

  function configure(opts: Partial<typeof defaults.value>) {
    const newDefaults = { ...defaults.value, ...opts }
    defaults.value = newDefaults
  }

  function schedule(id: string, timeoutMs?: number) {
    const ms = timeoutMs ?? defaults.value.autoHideInMs
    if (!ms || ms <= 0)
      return
    clear(id)
    const started = Date.now()
    const tid = setTimeout(() => remove(id), ms)
    timers.set(id, { timerId: tid, remainingMs: ms, started })
  }

  function clear(id: string) {
    const timer = timers.get(id)
    if (timer?.timerId)
      clearTimeout(timer.timerId)
    timers.delete(id)
  }

  function pause(id: string) {
    if (!defaults.value.hoverPause)
      return
    const t = timers.get(id)
    if (!t?.timerId)
      return
    clearTimeout(t.timerId)
    const elapsed = Date.now() - t.started
    timers.set(id, { timerId: null, remainingMs: Math.max(0, t.remainingMs - elapsed), started: 0 })
  }

  function resume(id: string) {
    const t = timers.get(id)
    if (!t || t.remainingMs <= 0)
      return
    const started = Date.now()
    const tid = setTimeout(() => remove(id), t.remainingMs)
    timers.set(id, { timerId: tid, remainingMs: t.remainingMs, started })
  }

  function push(toast: Omit<Notification, 'id'>) {
    const id = (() => {
      if (!globalThis.crypto?.randomUUID) {
        return Math.random().toString(36).slice(2)
      }
      return globalThis.crypto.randomUUID()
    })()

    const entry: Notification = { id, ...toast }
    notificationsList.value.push(entry)
    schedule(id, entry.timeoutMs)
    return id
  }

  function remove(id: string) {
    const index = notificationsList.value.findIndex(x => x.id === id)
    if (index !== -1)
      notificationsList.value.splice(index, 1)
    clear(id)
  }

  function removeAll() {
    notificationsList.value.forEach(item => clear(item.id))
    notificationsList.value = []
  }

  return { items: notificationsList, configure, push, remove, pause, resume, removeAll }
})

export interface Notifier {
  success: (message: string, title?: string, time?: number) => string
  error: (message: string, title?: string, time?: number) => string
  info: (message: string, title?: string, time?: number) => string
  warning: (message: string, title?: string, time?: number) => string
  dismiss: (id: string) => void
  clear: () => void
}

export function createNotifier(pinia?: Pinia): Notifier {
  const store = useNotificationsStore(pinia)
  return {
    success: (message: string, title?: string, time?: number) => store.push({ type: 'success', message, title, timeoutMs: time }),
    error: (message: string, title?: string, time?: number) => store.push({ type: 'error', message, title, timeoutMs: time }),
    info: (message: string, title?: string, time?: number) => store.push({ type: 'info', message, title, timeoutMs: time }),
    warning: (message: string, title?: string, time?: number) => store.push({ type: 'warning', message, title, timeoutMs: time }),
    dismiss: (id: string) => store.remove(id),
    clear: () => store.removeAll(),
  }
}

export const NOTIFIER_TOKEN = token<Notifier>('NOTIFIER_TOKEN')
