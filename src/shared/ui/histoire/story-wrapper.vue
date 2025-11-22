<script lang="ts" setup>
</script>

<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: clamp(500px, 100%, 100%);
  padding: 20px;
  overflow: auto;
}
</style>
