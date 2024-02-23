<script setup lang="ts">
import { DownloadPhoto } from '@tf-app/features/download-photo'
import { ToggleFavoritePhoto } from '@tf-app/features/toggle-favorite-photo'
import { TfLazyImage } from '@tf-app/shared/ui'

defineProps<{ photo: Photo }>()
</script>

<template>
  <article :class="classes.photoCard">
    <TfLazyImage
      :original-src="`${photo.urls.raw}&w=640&h=640&dpr=2&q=80`"
      :alt="photo.alt_description"
      :placeholder-src="photo.urls.thumb"
      :srcset="`${photo.urls.raw}&w=320&h=320&dpr=1&q=80 320w, ${photo.urls.raw}&w=640&h=640&dpr=2&q=80 640w, ${photo.urls.raw}&w=1024&h=1024dpr=3&q=80 1024w`"
      sizes="(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px"
      :class="classes.photo"
    />
    <RouterLink :to="`/${photo.id}`" :class="classes.photoLink" :title="photo.alt_description" />
    <div :class="classes.overlay" />
    <div :class="classes.actions">
      <ToggleFavoritePhoto :photo="photo" />
      <DownloadPhoto :src="photo.urls.full" :name="photo.id" />
    </div>
  </article>
</template>

<style module="classes">
.photoCard {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-sm);
  z-index: 1;
}

.overlay {
  inset: 0;
  position: absolute;
  z-index: 2;
  pointer-events: none;
}

.actions {
  position: absolute;
  z-index: 4;
  top: 10px;
  left: 10px;
  display: none;
}

.photoLink:hover + .overlay, .photoCard:has(.actions:hover) > .overlay  {
  background-image: linear-gradient(180deg,#00000057 0,rgb(0 0 0 / 33.8%) 3.5%,rgb(0 0 0 / 32.4%) 7%,rgb(0 0 0 / 30.6%) 10.35%,rgb(0 0 0 / 28.5%) 13.85%,rgb(0 0 0 / 26.2%) 17.35%,rgb(0 0 0 / 23.7%) 20.85%,rgb(0 0 0 / 21.3%) 24.35%,rgb(0 0 0 / 18.8%) 27.85%,rgb(0 0 0 / 16.5%) 31.35%,rgb(0 0 0 / 14.4%) 34.85%,rgb(0 0 0 / 12.6%) 38.35%,rgb(0 0 0 / 11.2%) 41.85%,rgb(0 0 0 / 10.3%) 45.35%,#0000001a 48.85%,rgb(0 0 0 / 10.3%) 52.35%,rgb(0 0 0 / 11.2%) 55.85%,rgb(0 0 0 / 12.6%) 59.35%,rgb(0 0 0 / 14.4%) 62.85%,rgb(0 0 0 / 16.5%) 66.35%,rgb(0 0 0 / 18.8%) 69.85%,rgb(0 0 0 / 21.3%) 73.35%,rgb(0 0 0 / 23.7%) 76.85%,rgb(0 0 0 / 26.2%) 80.35%,rgb(0 0 0 / 28.5%) 83.85%,rgb(0 0 0 / 30.6%) 87.35%,rgb(0 0 0 / 32.4%) 90.85%,rgb(0 0 0 / 33.8%) 94.35%,rgb(0 0 0 / 34.7%) 97.85%,#00000059);
  transition: opacity .1s ease-in-out,visibility .1s ease-in-out;
}

.photoLink:focus::before {
  outline: 3px dashed var(--font-color);
  outline-offset: 2px;
}

.actions:hover, .photoLink:hover + .overlay + .actions   {
  display: flex;
  gap: 20px;
  align-items: center;
}

.photoCard > .photoLink {
  color: var(--c-black);
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  display: inline-block;
}

.photo {
  height: 440px;
  width: 100%;
  border-radius: var(--border-radius-sm);
}

.photoCard > .photoLink::before {
  position: absolute;
  content: '';
  inset: 0;
  z-index: 3;
}

@media (hover: none) {
  .photoLink:hover + .overlay, .photoCard:has(.actions:hover) > .overlay  {
    display: none;
  }

  .actions:hover, .photoLink:hover + .overlay + .actions   {
    display: none;
  }
}

@media screen and (width <= 376px) {
  .photo {
    height: 320px;
  }
}
</style>
