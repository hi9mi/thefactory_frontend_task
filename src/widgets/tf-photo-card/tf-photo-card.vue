<script setup lang="ts">
import type { GalleryItem } from '@tf-app/entities/gallery'

import DownloadPhoto from '@tf-app/features/download-photo/download-photo.vue'
import ToggleFavoritePhoto from '@tf-app/features/toggle-favorite-photo/toggle-favorite-photo.vue'
import TfBlurhashImage from '@tf-app/shared/ui/data-display/tf-blurhash-image/tf-blurhash-image.vue'

defineProps<{ photo: GalleryItem }>()
</script>

<template>
  <article
    :class="classes.photoCard"
  >
    <TfBlurhashImage
      :id="photo.id"
      :blurhash="photo.blurHash ?? null"
      :blurhash-width="440"
      :blurhash-height="440"
      :src="`${photo.urlRaw}&w=640&h=640&dpr=2&q=80`"
      :alt="photo.alt"
      :srcset="`${photo.urlRaw}&w=320&h=320&dpr=1&q=80 320w, ${photo.urlRaw}&w=640&h=640&dpr=2&q=80 640w, ${photo.urlRaw}&w=1024&h=1024&dpr=3&q=80 1024w`"
      sizes="(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px"
      :class="classes.photo"
    />
    <RouterLink
      :to="`/photo/${photo.id}`"
      :class="classes.photoLink"
      :title="photo.alt"
    />
    <div :class="classes.overlay" aria-hidden="true" data-testid="photo-actions-overlay" />
    <div :class="classes.actions">
      <ToggleFavoritePhoto :photo="photo" />
      <DownloadPhoto :src="photo.urlRaw ?? ''" :name="photo.id" />
    </div>
  </article>
</template>

<style module="classes">
.photoCard {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-small);
  z-index: 1;
  height: 100%;
  width: 100%;
}

.overlay {
  inset: 0;
  position: absolute;
  z-index: 2;
  pointer-events: none;
  background-image: linear-gradient(180deg, rgb(0 0 0 / 57%) 0%, rgb(0 0 0 / 34%) 50%, rgb(0 0 0 / 59%) 100%);
}

.actions {
  position: absolute;
  z-index: 4;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.photoLink:focus-visible::before {
  outline: 3px dashed var(--text-color-default);
  outline-offset: 2px;
}

.photoCard > .photoLink {
  color: var(--color-black);
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  display: inline-block;
}

.photo {
  border-radius: var(--border-radius-small);
  height: 100%;
}

.photoCard > .photoLink::before {
  position: absolute;
  content: '';
  inset: 0;
  z-index: 3;
}

.overlay,
.actions {
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.12s ease,
    visibility 0.12s ease;
}

.photoCard:hover .overlay,
.photoCard:focus-within .overlay,
.photoCard:hover .actions,
.photoCard:focus-within .actions {
  opacity: 1;
  visibility: visible;
}

.overlay {
  pointer-events: none;
}

.actions {
  pointer-events: none;
}
.photoCard:hover .actions,
.photoCard:focus-within .actions {
  pointer-events: auto;
}

@media (hover: none) {
  .photoLink:hover + .overlay,
  .photoCard:has(.actions:hover) > .overlay {
    display: none;
  }

  .actions:hover,
  .photoLink:hover + .overlay + .actions {
    display: none;
  }
}
</style>
