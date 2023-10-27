import type { InjectionKey } from 'vue'

export interface NotificationsContext {
  autoHideInMs?: number
  hasRemoveButton?: boolean
  shouldNotHideOnHover?: boolean
}

export const NOTIFICATION_COLORS = {
  error: '#fa5252',
  success: '#40c057',
} as const

export const NOTIFICATIONS_CONTEXT_SYMBOL = Symbol('notifications-context') as InjectionKey<NotificationsContext>
