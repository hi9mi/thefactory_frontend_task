<script setup lang="ts">
defineProps<{ photo: Photo }>()
</script>

<template>
  <article class="photo-card">
    <img
      :key="photo.id"
      :src="photo.urls.regular"
      :alt="photo.alt_description"
      :srcset="`${photo.urls.small} 480w, ${photo.urls.regular} 800w, ${photo.urls.full} 1920w`"
      sizes="(max-width: 600px) 480px, 800px"
      class="photo"
    >
    <h3 class="photo-name">
      <RouterLink :to="`/${photo.id}`" class="photo-link">
        {{ photo.alt_description }}
      </RouterLink>
    </h3>
  </article>
</template>

<style scoped>
.photo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.photo-name {
  text-align: center;
}

.photo-name > .photo-link {
  color: #000;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  display: inline-block;
}

.photo-name > .photo-link::first-letter {
  text-transform: uppercase;
}

.photo {
  height: 440px;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.photo-name > .photo-link::before {
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
