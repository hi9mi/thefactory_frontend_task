<script setup lang="ts">
import ArrowTopIcon from '~icons/tf-icons/arrow-top'

import { onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const isShowAffix = ref(false)

function onScroll() {
  if (window.scrollY >= 100)
    isShowAffix.value = true
  else
    isShowAffix.value = false
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <Teleport to="#affix">
    <Transition
      name="affix"
    >
      <button
        v-if="isShowAffix"
        v-bind="$attrs"
        :class="classes.affix"
        @click="scrollToTop"
      >
        <ArrowTopIcon
          fill="none"
          width="18"
          height="18"
          aria-label="Вернуться наверх страницы"
        />
      </button>
    </Transition>
  </Teleport>
</template>

<style scoped>
.affix-enter-active,
.affix-leave-active {
  transition: all 0.5s ease;
}

.affix-enter-from,
.affix-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<style module="classes">
.affix {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background-color: var(--background-color-primary);
  border: none;
  outline: none;
  box-shadow: var(--shadow-medium);
  border-radius: var(--border-radius-small);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  color: var(--text-color-default);
  cursor: pointer;
}

.affix:focus-visible {
  outline: 3px dashed var(--text-color-default);
  outline-offset: 4px;
}
</style>
