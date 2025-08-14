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
  transition?: 'slide' | 'fade' | 'bounce' | 'flip' | 'zoom' | 'elastic' | 'fly-in' | 'swoop' | 'glow'
  autoHideInMs?: number
  shouldNotHideOnHover?: boolean
  hasRemoveButton?: boolean
}>(), {
  target: '#notifications',
  position: 'bottom-left',
  gap: 12,
  zIndex: 100,
  transition: 'fade',
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
  z-index: var(--zIndex, 100);

  width: clamp(280px, 30vw, 420px);
  max-width: calc(100vw - 2 * 16px);

  padding: 20px;
  padding-left: calc(20px + env(safe-area-inset-left));
  padding-right: calc(20px + env(safe-area-inset-right));
  padding-bottom: calc(20px + env(safe-area-inset-bottom));

  container-type: inline-size;
  container-name: tf-notifications-container;
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
  width: 100%;
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

[data-position^='top'] *-enter-from,
[data-position^='top'] *-leave-to,
[data-position^='top'] *-appear-from {
  transform-origin: top center;
}

[data-position^='bottom'] *-enter-from,
[data-position^='bottom'] *-leave-to,
[data-position^='bottom'] *-appear-from {
  transform-origin: bottom center;
}

[data-position$='left'] *-enter-from,
[data-position$='left'] *-leave-to,
[data-position$='left'] *-appear-from {
  transform-origin: center left;
}

[data-position$='right'] *-enter-from,
[data-position$='right'] *-leave-to,
[data-position$='right'] *-appear-from {
  transform-origin: center right;
}

/* slide */
.slide-enter-active,
.slide-leave-active,
.slide-appear-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-enter-from,
.slide-appear-from {
  opacity: 0;
  transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(0.95);
}
.slide-leave-to {
  opacity: 0;
  transform: translate(var(--leave-x, 0), var(--leave-y, 0)) scale(0.95);
}
.slide-move {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* fade */
.fade-enter-active,
.fade-leave-active,
.fade-appear-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to,
.fade-appear-from {
  opacity: 0;
}
.fade-move {
  transition: transform 0.3s ease;
}

/* bounce */
.bounce-enter-active,
.bounce-appear-active {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.bounce-leave-active {
  animation: bounce-out 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.bounce-enter-from,
.bounce-leave-to,
.bounce-appear-from {
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(0.3);
  }
  50% {
    opacity: 0.8;
    transform: translate(0, 0) scale(1.15);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}
@keyframes bounce-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--leave-x, 0), var(--leave-y, 0)) scale(0.3);
  }
}
.bounce-move {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* flip */
.flip-enter-active,
.flip-leave-active,
.flip-appear-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
}
.flip-enter-from,
.flip-appear-from {
  opacity: 0;
  transform: translate(var(--enter-x, 0), var(--enter-y, 0)) perspective(400px) rotateX(90deg);
}
.flip-leave-to {
  opacity: 0;
  transform: translate(var(--leave-x, 0), var(--leave-y, 0)) perspective(400px) rotateX(-90deg);
}
.flip-move {
  transition: transform 0.3s ease;
}

/* zoom */
.zoom-enter-active,
.zoom-leave-active,
.zoom-appear-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.zoom-enter-from,
.zoom-appear-from {
  opacity: 0;
  transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(0.5);
}
.zoom-leave-to {
  opacity: 0;
  transform: translate(var(--leave-x, 0), var(--leave-y, 0)) scale(1.2);
}
.zoom-move {
  transition: transform 0.3s ease;
}

/* elastic */
.elastic-enter-active,
.elastic-appear-active {
  animation: elastic-in 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.elastic-leave-active {
  animation: elastic-out 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.elastic-enter-from,
.elastic-leave-to,
.elastic-appear-from {
  opacity: 0;
}
@keyframes elastic-in {
  0% {
    opacity: 0;
    transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(0) rotate(-180deg);
  }
  60% {
    opacity: 0.8;
    transform: translate(0, -5px) scale(1.2) rotate(-60deg);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
}
@keyframes elastic-out {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(var(--leave-x, 0), var(--leave-y, 0)) scale(0) rotate(180deg);
  }
}
.elastic-move {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* fly-in */
.fly-in-enter-active,
.fly-in-leave-active,
.fly-in-appear-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fly-in-enter-from,
.fly-in-appear-from {
  opacity: 0;
  transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(0.8) rotate(-10deg);
}
.fly-in-leave-to {
  opacity: 0;
  transform: translate(var(--leave-x, 0), var(--leave-y, 0)) scale(1.1) rotate(10deg);
}
.fly-in-move {
  transition: transform 0.3s ease;
}

/* swoop */
.swoop-enter-active,
.swoop-appear-active {
  animation: swoop-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.swoop-leave-active {
  animation: swoop-out 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.swoop-enter-from,
.swoop-leave-to,
.swoop-appear-from {
  opacity: 0;
}
@keyframes swoop-in {
  0% {
    opacity: 0;
    transform: translate(var(--enter-x, 0), calc(var(--enter-y, 0) * 2)) scale(0.6) rotate(-15deg);
  }
  30% {
    opacity: 0.5;
    transform: translate(calc(var(--enter-x, 0) * 0.3), var(--enter-y, 0)) scale(0.8) rotate(-5deg);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
}
@keyframes swoop-out {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(var(--leave-x, 0), var(--leave-y, 0)) scale(0.8) rotate(15deg);
  }
}
.swoop-move {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* glow */
.glow-enter-active,
.glow-leave-active,
.glow-appear-active {
  transition: all 0.4s ease;
}
.glow-enter-from,
.glow-appear-from {
  opacity: 0;
  transform: translate(var(--enter-x, 0), var(--enter-y, 0)) scale(0.9);
  box-shadow: 0 0 0 rgba(59, 130, 246, 0);
}
.glow-enter-to,
.glow-appear-to {
  opacity: 1;
  transform: translate(0, 0) scale(1);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
.glow-leave-from {
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
.glow-leave-to {
  opacity: 0;
  transform: translate(var(--leave-x, 0), var(--leave-y, 0)) scale(1.1);
  box-shadow: 0 0 0 rgba(59, 130, 246, 0);
}
.glow-move {
  transition: transform 0.3s ease;
}
</style>
