<script setup lang="ts">
defineProps<{ photo: Photo }>()
</script>

<template>
  <article class="photo-card">
    <img
      :key="photo.id"
      :src="photo.urls.regular"
      :alt="photo.alt_description"
      :srcset="`${photo.urls.small} 320w, ${photo.urls.regular} 440w, ${photo.urls.full} 1920w`"
      sizes="(max-width: 600px) 320px, 440px"
      class="photo"
    >
    <RouterLink :to="`/${photo.id}`" class="photo-link" />
  </article>
</template>

<style scoped>
.photo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.photo-card > .photo-link {
  color: #000;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  display: inline-block;
}

.photo {
  height: 440px;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.photo-card > .photo-link::before {
  position: absolute;
  content: '';
  inset: 0;
}

@media screen and (width <= 376px) {
  .photo {
    height: 320px;
  }
}
</style>
