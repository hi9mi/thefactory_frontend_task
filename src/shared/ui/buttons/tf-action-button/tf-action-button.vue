<script setup lang="ts">
</script>

<template>
  <button :class="classes.actionBtn">
    <slot />
  </button>
</template>

<style module="classes">
.actionBtn {
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  outline: none;
  padding: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--font-color);
}

.actionBtn:focus {
  outline: none;
}

.actionBtn:focus-visible {
  outline: 3px dashed var(--font-color);
  outline-offset: 2px;
}

.actionBtn:active {
  transform: translateY(2px);
}

.actionBtn:disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}
</style>
