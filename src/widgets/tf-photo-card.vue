<script setup lang="ts">
defineProps<{ photo: Photo }>()
</script>

<template>
  <RouterLink :to="`/${photo.id}`">
    <img
      :key="photo.id"
      :src="photo.urls.regular"
      :alt="photo.alt_description"
      class="photo"
    >
  </RouterLink>
</template>

<style scoped>
.photo {
  height: 440px;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

@media screen and (width <= 376px) {
  .photo {
    height: 320px;
  }
}
</style>
