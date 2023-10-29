<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import VueInlineSvg from 'vue-inline-svg'

import xMarkIcon from '@tf-app/shared/assets/icons/x-mark.svg'

import { NOTIFICATION_COLORS, NOTIFICATIONS_CONTEXT_SYMBOL } from './config'
import type { NotificationOptions } from './libs'
import { emitter } from './libs'

const props = defineProps<{
  notification: NotificationOptions
}>()
const emit = defineEmits<{
  (e: 'click', notification: NotificationOptions): void
}>()
const context = inject(NOTIFICATIONS_CONTEXT_SYMBOL)

const styleVariables = computed(() => ({
  '--notification-color': NOTIFICATION_COLORS[props.notification.type],
}))

let autoHideTimeoutId: ReturnType<typeof setTimeout>
function hideAfterTimeout() {
  if (context?.autoHideInMs) {
    autoHideTimeoutId = setTimeout(() => {
      emitter.emit('remove', props.notification.id)
    }, context.autoHideInMs)
  }
}

function handleMouseEnter() {
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
    class="notification"
    :style="styleVariables"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="emit('click', notification)"
  >
    <span
      v-if="notification.title"
      class="title"
    >
      {{ notification.title }}
    </span>
    <span class="message">{{ notification.message }}</span>
    <button
      v-if="context?.hasRemoveButton"
      class="remove-btn"
      type="button"
      @click="emitter.emit('remove', notification.id)"
    >
      <VueInlineSvg
        :src="xMarkIcon"
        width="16"
        height="16"
        aria-label="Скрыть уведомление"
      />
    </button>
  </li>
</template>

<style scoped>
.notification {
  position: relative;
  padding: 10px 22px;
  background-color: #fff;
  box-shadow: 3px 4px 10px -2px rgb(34 60 80 / 30%);
  border-radius: 4px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
}

.notification::before {
  background-color: var(--notification-color);
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  content: "";
  display: block;
  width: 3px;
  height: 80%;
  border-radius: 4px;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: #000;
  display: inline-block;
  margin-bottom: 3px;
}

.message {
  font-size: 14px;
  font-weight: 400;
  color: #868e96;
  display: inline-block;
}

.remove-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  background-color: transparent;
  border: none;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
}
</style>
