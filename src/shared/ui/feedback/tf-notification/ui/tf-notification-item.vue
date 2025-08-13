<script setup lang="ts">
import type { Notification } from '../model'
import XMarkIcon from '~icons/tf-icons/x-mark'
import { useNotificationsStore } from '../model'

const props = defineProps<{ notification: Notification, hasRemoveButton?: boolean }>()
const store = useNotificationsStore()

function onEnter() {
  store.pause(props.notification.id)
}
function onLeave() {
  store.resume(props.notification.id)
}
function onRemove() {
  store.remove(props.notification.id)
}
</script>

<template>
  <li
    :class="classes.item"
    :data-type="notification.type"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <span v-if="notification.title" :class="classes.title">{{ notification.title }}</span>
    <span :class="classes.message">{{ notification.message }}</span>
    <button v-if="hasRemoveButton" :class="classes.removeBtn" @click.stop="onRemove">
      <XMarkIcon width="16" height="16" aria-label="Скрыть уведомление" />
    </button>
  </li>
</template>

<style module="classes">
.item {
  position: relative;
  padding: 10px 22px;
  background: var(--background-color-primary);
  box-shadow: var(--shadow-large);
  border-radius: var(--border-radius-small);
  min-width: 220px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
}
.item::before {
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  content: '';
  display: block;
  width: 3px;
  height: 80%;
  border-radius: var(--border-radius-small);
}
.item[data-type='success']::before {
  background: var(--color-fruit-salad);
}
.item[data-type='error']::before {
  background: var(--color-sunset-orange);
}
.item[data-type='info']::before {
  background: var(--color-info, #1e3a8a);
}
.item[data-type='warning']::before {
  background: var(--color-warning, #8a6d1e);
}
.title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-default);
  margin-bottom: 3px;
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.message {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-light-slate-grey);
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.removeBtn {
  position: absolute;
  right: 6px;
  top: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-color-default);
}
</style>
