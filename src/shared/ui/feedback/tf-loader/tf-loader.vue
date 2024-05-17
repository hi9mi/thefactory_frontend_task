<script setup lang="ts">
import LoaderIcon from '~icons/tf-icons/loader'
</script>

<template>
  <div
    role="status"
    :class="classes.loader"
  >
    <LoaderIcon
      width="22"
      height="22"
      aria-hidden="true"
      :class="classes.spinner"
    />
    <span class="sr-only">Загрузка...</span>
  </div>
</template>

<style module="classes">
.loader {
  margin: 100px auto;
  width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  color: var(--text-color-default);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
