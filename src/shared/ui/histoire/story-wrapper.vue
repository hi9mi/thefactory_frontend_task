<script lang="ts" setup>
</script>

<template>
  <div
    class="wrapper"
  >
    <slot />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 100%;
  height: 500px;
  padding: 20px;
}
</style>
