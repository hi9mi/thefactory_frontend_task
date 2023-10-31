<script setup lang="ts">
</script>

<template>
  <button class="action-btn">
    <slot />
  </button>
</template>

<style scoped>
.action-btn {
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  outline: none;
  padding: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.action-btn:focus {
  outline: none
}

.action-btn:focus-visible {
  outline: 3px dashed var(--c-black);
  outline-offset: 2px;
}

.action-btn:active {
  transform: translateY(2px);
}
</style>
