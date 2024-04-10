<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue'

import { NOTIFICATIONS_CONTEXT_SYMBOL } from './config'
import type { NotificationOptions } from './libs'
import { emitter } from './libs'

import XMarkIcon from '~icons/tf-icons/x-mark'

const props = defineProps<{
  notification: NotificationOptions
}>()
const emit = defineEmits<{
  (e: 'click', notification: NotificationOptions): void
}>()
const context = inject(NOTIFICATIONS_CONTEXT_SYMBOL)

let autoHideTimeoutId: ReturnType<typeof setTimeout>
function hideAfterTimeout() {
  if (context?.autoHideInMs) {
    autoHideTimeoutId = setTimeout(() => {
      emitter.emit('remove', props.notification.id)
    }, context.autoHideInMs)
  }
}

function handleMouseEnter() {
  if (context?.shouldNotHideOnHover)
    clearTimeout(autoHideTimeoutId)
}

function handleMouseLeave() {
  hideAfterTimeout()
}

onMounted(() => {
  hideAfterTimeout()
})
onBeforeUnmount(() => {
  clearTimeout(autoHideTimeoutId)
})
</script>

<template>
  <li
    :key="notification.id"
    :class="[classes.notification, classes[notification.type]]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="emit('click', notification)"
  >
    <span
      v-if="notification.title"
      :class="classes.title"
    >
      {{ notification.title }}
    </span>
    <span :class="classes.message">{{ notification.message }}</span>
    <button
      v-if="context?.hasRemoveButton"
      :class="classes.removeBtn"
      type="button"
      @click="emitter.emit('remove', notification.id)"
    >
      <XMarkIcon
        width="16"
        height="16"
        aria-label="Скрыть уведомление"
      />
    </button>
  </li>
</template>

<style module="classes">
.notification {
  position: relative;
  padding: 10px 22px;
  background-color: var(--c-primary-bg);
  box-shadow: var(--box-shadow-lg);
  border-radius: var(--border-radius-sm);
  min-width: 220px;
  max-width: 320px;
  display: flex;
  flex-direction: column;

}

.notification::before {
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  content: "";
  display: block;
  width: 3px;
  height: 80%;
  border-radius: var(--border-radius-sm);
}

.success::before {
  background-color: var(--c-fruit-salad);
}

.error::before {
  background-color: var(--c-sunset-orange);
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: var(--font-color);
  margin-bottom: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message {
  font-size: 14px;
  font-weight: 400;
  color: var(--c-light-slate-grey);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.removeBtn {
  position: absolute;
  right: 6px;
  top: 6px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  color: var(--font-color);
}
</style>
