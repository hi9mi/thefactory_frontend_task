import type { InjectionKey } from 'vue'

export interface NotificationsContext {
  autoHideInMs?: number
  hasRemoveButton?: boolean
  shouldNotHideOnHover?: boolean
}

export const NOTIFICATIONS_CONTEXT_SYMBOL = Symbol('notifications-context') as InjectionKey<NotificationsContext>
