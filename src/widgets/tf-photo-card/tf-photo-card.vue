<script setup lang="ts">
import { ToggleFavoritePhoto } from '@tf-app/features/toggle-favorite-photo'

defineProps<{ photo: Photo }>()
</script>

<template>
  <article :class="classes.photoCard">
    <img
      :src="photo.urls.regular"
      :alt="photo.alt_description"
      :srcset="`${photo.urls.small} 320w, ${photo.urls.regular} 440w, ${photo.urls.full} 1920w`"
      sizes="(max-width: 600px) 320px, 440px"
      :class="classes.photo"
    >
    <RouterLink :to="`/${photo.id}`" :class="classes.photoLink" :title="photo.alt_description" />
    <div :class="classes.overlay" />
    <div :class="classes.actions">
      <ToggleFavoritePhoto :photo="photo" />
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

.photoCard::before {
  content: "";
  position: absolute;
  background-color: var(--c-weathered-stone);
  inset: 1px;
  z-index: -1;
  border-radius: inherit;
  transition: all 0.35s ease;
}

:global(html:is(.dark)) .photoCard::before {
  background-color: var(--c-light-slate-grey);
}

.photoCard:has(.photoLink:hover)::before, .photoCard:has(.actions:hover)::before  {
  transform: rotate(10deg);
}

.photoLink:hover + .overlay, .photoCard:has(.actions:hover) > .overlay  {
  background-image: linear-gradient(180deg,#00000057 0,rgb(0 0 0 / 33.8%) 3.5%,rgb(0 0 0 / 32.4%) 7%,rgb(0 0 0 / 30.6%) 10.35%,rgb(0 0 0 / 28.5%) 13.85%,rgb(0 0 0 / 26.2%) 17.35%,rgb(0 0 0 / 23.7%) 20.85%,rgb(0 0 0 / 21.3%) 24.35%,rgb(0 0 0 / 18.8%) 27.85%,rgb(0 0 0 / 16.5%) 31.35%,rgb(0 0 0 / 14.4%) 34.85%,rgb(0 0 0 / 12.6%) 38.35%,rgb(0 0 0 / 11.2%) 41.85%,rgb(0 0 0 / 10.3%) 45.35%,#0000001a 48.85%,rgb(0 0 0 / 10.3%) 52.35%,rgb(0 0 0 / 11.2%) 55.85%,rgb(0 0 0 / 12.6%) 59.35%,rgb(0 0 0 / 14.4%) 62.85%,rgb(0 0 0 / 16.5%) 66.35%,rgb(0 0 0 / 18.8%) 69.85%,rgb(0 0 0 / 21.3%) 73.35%,rgb(0 0 0 / 23.7%) 76.85%,rgb(0 0 0 / 26.2%) 80.35%,rgb(0 0 0 / 28.5%) 83.85%,rgb(0 0 0 / 30.6%) 87.35%,rgb(0 0 0 / 32.4%) 90.85%,rgb(0 0 0 / 33.8%) 94.35%,rgb(0 0 0 / 34.7%) 97.85%,#00000059);
  transition: opacity .1s ease-in-out,visibility .1s ease-in-out;
}

.actions:hover, .photoLink:hover + .overlay + .actions   {
  display: flex;
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
  object-fit: cover;
  object-position: center;
  border-radius: var(--border-radius-sm);
}

.photoCard > .photoLink::before {
  position: absolute;
  content: '';
  inset: 0;
  z-index: 3;
}

@media screen and (width <= 376px) {
  .photo {
    height: 320px;
  }
}
</style>
