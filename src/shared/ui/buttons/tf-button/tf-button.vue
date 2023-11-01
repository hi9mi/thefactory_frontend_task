<script setup lang="ts">
import { computed } from 'vue'

import { BUTTON_BG_COLORS } from './config'

const props = defineProps<{
  bgColor: 'white' | 'yellow'
}>()

const style = computed(() => ({
  '--background-color': BUTTON_BG_COLORS[props.bgColor],
}))
</script>

<template>
  <button :class="classes.btn" :style="style">
    <slot />
  </button>
</template>

<style module='classes'>
.btn {
  background-color: var(--background-color);
  border: none;
  border-radius: var(--border-radius-md);
  outline: none;
  color: var(--c-black);
  padding: 13px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: var(--box-shadow-sm);
}

.btn:hover {
  filter: brightness(0.8);
}

.btn:focus {
  outline: none
}

.btn:focus-visible {
  outline: 3px dashed var(--background-color);
  outline-offset: 2px;
}

.btn:active {
  transform: translateY(2px);
}
</style>
