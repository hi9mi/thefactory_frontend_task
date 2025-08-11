<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
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
}>(), { target: '#notifications', position: 'bottom-left', gap: 20, zIndex: 1000, transition: 'notifications' })

const store = useNotificationsStore()
const { items } = storeToRefs(store)

// прокинем конфиг в стор
onMounted(() => {
  store.configure({
    autoHideInMs: props.autoHideInMs ?? 3500,
    hoverPause: props.shouldNotHideOnHover ?? true,
  })
})
watch(() => [props.autoHideInMs, props.shouldNotHideOnHover], () => {
  store.configure({
    autoHideInMs: props.autoHideInMs ?? 3500,
    hoverPause: props.shouldNotHideOnHover ?? true,
  })
})
</script>

<template>
  <Teleport :to="props.target">
    <div class="notifications" :class="props.position" :style="{ zIndex, gap: `${gap}px` }">
      <TransitionGroup :name="transition" tag="ul" class="list" role="status" aria-live="polite">
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

<style scoped>
.notifications {
  position: fixed;
  padding: 20px;
}
.notifications.bottom-left {
  bottom: 0;
  left: 0;
}
.notifications.bottom-right {
  bottom: 0;
  right: 0;
}
.notifications.top-left {
  top: 0;
  left: 0;
}
.notifications.top-right {
  top: 0;
  right: 0;
}
.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--gap, 20px);
  padding: 0;
  margin: 0;
}
</style>

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
</style>
