import mitt from 'mitt'

import { generateNextId } from '@tf-app/shared/libs'

export type NotificationTypes = 'error' | 'success'
export interface NotificationOptions {
  id: string
  message: string
  type: NotificationTypes
  title?: string
}

interface EventType {
  add: NotificationOptions
  remove: string
}

// @ts-expect-error issue with TypeScript interfaces in general: a specific interface cannot be saved into a more generic interface
export const emitter = mitt<EventType>()

export function notify(options: Omit<NotificationOptions, 'id'>) {
  (options as NotificationOptions).id = generateNextId('notification')
  emitter.emit('add', options as NotificationOptions)
}

notify.remove = (id: string) => {
  emitter.emit('remove', id)
}
