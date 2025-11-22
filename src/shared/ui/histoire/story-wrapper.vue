<script lang="ts" setup>
import '../../../app/styles/index.css'
</script>

<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  place-content: center;
  width: 100%;
  max-height: 100%;
  min-height: 500px;
  padding: 20px;
  overflow: auto;
}
</style>
