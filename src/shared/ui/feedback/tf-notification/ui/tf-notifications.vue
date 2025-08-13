<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useNotificationsStore } from '../model'
import TfNotificationItem from './tf-notification-item.vue'

const props = withDefaults(defineProps<{
  target?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  gap?: number
  zIndex?: number
  transition?: string
  autoHideInMs?: number
  shouldNotHideOnHover?: boolean
  hasRemoveButton?: boolean
}>(), {
  target: '#notifications',
  position: 'top-right',
  gap: 20,
  zIndex: 1000,
  transition: 'notifications',
  autoHideInMs: 5000,
  shouldNotHideOnHover: true,
})

const store = useNotificationsStore()
const { items } = storeToRefs(store)

watch(() => [props.autoHideInMs, props.shouldNotHideOnHover], () => {
  store.configure({
    autoHideInMs: props.autoHideInMs ?? 5000,
    hoverPause: props.shouldNotHideOnHover ?? true,
  })
}, { immediate: true })
</script>

<template>
  <Teleport :to="props.target">
    <div
      :class="[classes.container, classes[position]]"
      :style="{ '--zIndex': zIndex, '--gap': `${gap}px` }"
      :data-position="position"
    >
      <TransitionGroup
        :name="transition"
        tag="ul"
        :class="classes.list"
        role="status"
        aria-live="polite"
        move-class="notifications-move"
        appear
        data-animated
      >
        <TfNotificationItem
          v-for="item in items"
          :key="item.id"
          :notification="item"
          :has-remove-button="hasRemoveButton"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style module="classes">
.container {
  position: fixed;
  padding: 20px;
  z-index: var(--zIndex, 1000);
}

.container.bottom-left {
  bottom: 0;
  left: 0;
}

.container.bottom-right {
  bottom: 0;
  right: 0;
}

.container.top-left {
  top: 0;
  left: 0;
}

.container.top-right {
  top: 0;
  right: 0;
}

.list {
  position: relative;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--gap, 20px);
  padding: 0;
  margin: 0;
}
</style>

<style scoped>
[data-position='top-left'] {
  --enter-x: -30px;
  --enter-y: -20px;
  --leave-x: -100px;
  --leave-y: 0px;
}

[data-position='top-right'] {
  --enter-x: 30px;
  --enter-y: -20px;
  --leave-x: 100px;
  --leave-y: 0px;
}

[data-position='bottom-left'] {
  --enter-x: -30px;
  --enter-y: 20px;
  --leave-x: -100px;
  --leave-y: 0px;
}

[data-position='bottom-right'] {
  --enter-x: 30px;
  --enter-y: 20px;
  --leave-x: 100px;
  --leave-y: 0px;
}

.notifications-enter-active,
.notifications-leave-active,
.notifications-appear-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.notifications-enter-from,
.notifications-appear-from {
  opacity: 0;
  transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(0.95);
}

.notifications-leave-to {
  opacity: 0;
  transform: translate(var(--leave-x, 0), var(--leave-y, 0)) scale(0.95);
}

.notifications-leave-active {
  position: absolute;
  width: 100%;
}

.notifications-move {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-position^='top'] .notifications-enter-from,
[data-position^='top'] .notifications-appear-from {
  transform: translate(var(--enter-x), var(--enter-y)) scale(0.95) rotateX(-10deg);
}

[data-position^='bottom'] .notifications-enter-from,
[data-position^='bottom'] .notifications-appear-from {
  transform: translate(var(--enter-x), var(--enter-y)) scale(0.95) rotateX(10deg);
}

[data-position$='left'] .notifications-leave-to {
  transform: translate(var(--leave-x), var(--leave-y)) scale(0.9) rotateZ(-5deg);
}

[data-position$='right'] .notifications-leave-to {
  transform: translate(var(--leave-x), var(--leave-y)) scale(0.9) rotateZ(5deg);
}
</style>
