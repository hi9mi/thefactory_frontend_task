<script setup lang="ts">
import VueInlineSvg from 'vue-inline-svg'

import loaderIcon from '@tf-app/shared/assets/icons/loader.svg'
</script>

<template>
  <div
    role="status"
    :class="classes.loader"
  >
    <VueInlineSvg
      :src="loaderIcon"
      width="22"
      height="22"
      aria-hidden="true"
      :class="classes.spinner"
    />
    <span class="srOnly">Загрузка...</span>
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
  color: var(--font-color);
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
