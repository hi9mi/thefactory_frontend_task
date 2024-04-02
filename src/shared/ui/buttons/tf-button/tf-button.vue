<script setup lang="ts">
defineProps<{
  bgColor: 'white' | 'yellow'
  disabled?: boolean
}>()
</script>

<template>
  <button :class="[classes.btn, classes[bgColor]]" :disabled="disabled">
    <slot />
  </button>
</template>

<style module='classes'>
.btn {
  border: none;
  border-radius: var(--border-radius-md);
  outline: none;
  color: var(--font-color);
  padding: 13px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: var(--box-shadow-sm);
}

.yellow {
  background-color: var(--c-secondary-bg);
  color: var(--c-squid-ink);
}

.white {
  background-color: var(--c-primary-bg);
}

.btn:hover {
  filter: brightness(0.95);
}

.btn:focus {
  outline: none
}

.btn:focus-visible {
  outline: 3px dashed var(--font-color);
  outline-offset: 2px;
}

.btn:active {
  transform: translateY(2px);
}

.btn:disabled {
  background-color: var(--c-weathered-stone);
  cursor: default;
  pointer-events: none;
}

:global(html:is(.dark)) .btn:hover {
  filter: brightness(0.99);
}

:global(html:is(.dark)) .btn:disabled {
  background-color: var(--c-light-slate-grey);
}

:global(html:is(.dark)) .btn.yellow:disabled {
  background-color: var(--c-light-slate-grey);
  color: var(--font-color);
}
</style>
