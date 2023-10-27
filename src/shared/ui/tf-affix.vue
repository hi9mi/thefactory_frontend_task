<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import VueInlineSvg from 'vue-inline-svg'

import arrowTopIcon from '../assets/icons/arrow-top.svg'

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
        class="affix"
        @click="scrollToTop"
      >
        <VueInlineSvg
          :src="arrowTopIcon"
          fill="none"
          width="18"
          height="18"
          aria-label="Вернуться наверх"
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

.affix {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background-color: #fff;
  border: none;
  outline: none;
  box-shadow: 0 0 4px 2px rgb(0 0 0 / 20%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  color: #000;
  cursor: pointer;
}
</style>
