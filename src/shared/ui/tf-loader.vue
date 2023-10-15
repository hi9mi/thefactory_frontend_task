<script setup lang="ts">
import VueInlineSvg from 'vue-inline-svg'

import loaderIcon from '../assets/icons/loader.svg'
</script>

<template>
  <div
    role="status"
    class="loader"
  >
    <VueInlineSvg
      :src="loaderIcon"
      width="22"
      height="22"
      aria-hidden="true"
      class="spinner"
    />
    <span class="sr-only">Загрузка...</span>
  </div>
</template>

<style scoped>
.loader {
  margin: 100px auto;
  width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.spinner {
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
