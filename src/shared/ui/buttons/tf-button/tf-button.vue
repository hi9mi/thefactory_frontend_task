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
  border-radius: var(--border-radius-medium);
  outline: none;
  color: var(--text-color-default);
  padding: 13px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: var(--shadow-small);
}

.yellow {
  background-color: var(--background-color-secondary);
  color: var(--color-squid-ink);
}

.white {
  background-color: var(--background-color-primary);
}

.btn:hover {
  filter: brightness(0.95);
}

.btn:focus {
  outline: none;
}

.btn:focus-visible {
  outline: 3px dashed var(--text-color-default);
  outline-offset: 2px;
}

.btn:active {
  transform: translateY(2px);
}

.btn:disabled {
  background-color: var(--color-weathered-stone);
  cursor: default;
  pointer-events: none;
}

:global(html:is(.dark)) .btn:hover {
  filter: brightness(0.99);
}

:global(html:is(.dark)) .btn:disabled {
  background-color: var(--color-light-slate-grey);
}

:global(html:is(.dark)) .btn.yellow:disabled {
  background-color: var(--color-light-slate-grey);
  color: var(--text-color-default);
}
</style>
