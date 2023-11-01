<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import VueInlineSvg from 'vue-inline-svg'

import arrowTopIcon from '@tf-app/shared/assets/icons/arrow-top.svg'

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
        :class="classes.affix"
        @click="scrollToTop"
      >
        <VueInlineSvg
          :src="arrowTopIcon"
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
/* stylelint-disable selector-class-pattern */
.affix-enter-active,
.affix-leave-active {
  transition: all 0.5s ease;
}

.affix-enter-from,
.affix-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* stylelint-enable selector-class-pattern */
</style>

<style module="classes">
.affix {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background-color: var(--c-white);
  border: none;
  outline: none;
  box-shadow: var(--box-shadow-md);
  border-radius: var(--border-radius-sm);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  color: var(--c-black);
  cursor: pointer;
}
</style>
