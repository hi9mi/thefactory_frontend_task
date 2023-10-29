<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, reactive } from 'vue'

import type { NotificationsContext } from './config'
import { NOTIFICATIONS_CONTEXT_SYMBOL } from './config'
import type { NotificationOptions } from './libs'
import { emitter } from './libs'
import TfNotification from './tf-notification.vue'

const props = defineProps<NotificationsContext>()
const emit = defineEmits<{
  (e: 'click', notification: NotificationOptions): void
  (e: 'remove', notification: NotificationOptions): void
}>()
provide(NOTIFICATIONS_CONTEXT_SYMBOL, props)

const notifications = reactive<NotificationOptions[]>([])

function notificationAdded(options: NotificationOptions) {
  notifications.push(options)
}

function notificationRemoved(id: string) {
  const notificationIndex = notifications.findIndex(notification => notification.id === id)
  emit('remove', notifications[notificationIndex])
  notifications.splice(notificationIndex, 1)
}

function notificationClicked(notification: NotificationOptions) {
  emit('click', notification)
}

onMounted(() => {
  emitter.on('add', notificationAdded)
  emitter.on('remove', notificationRemoved)
})
onBeforeUnmount(() => {
  emitter.off('add', notificationAdded)
  emitter.off('remove', notificationRemoved)
})
</script>

<template>
  <Teleport
    to="#notifications"
  >
    <div class="notifications-container">
      <TransitionGroup
        name="notifications"
        tag="ul"
        class="notifications"
        role="status"
        aria-live="polite"
        aria-relevant="additions removals"
      >
        <TfNotification
          v-for="notification of notifications"
          :key="notification.id"
          :notification="notification"
          @click="notificationClicked"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.notifications-enter-active,
.notifications-leave-active {
  transition: all 0.5s ease;
}

.notifications-enter-from,
.notifications-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.notifications-container {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;
  max-height: 100vh;
  overflow: hidden;
  z-index: 10;
}

.notifications {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
}
</style>
