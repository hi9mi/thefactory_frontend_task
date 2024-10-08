<script setup lang="ts">
import DownloadPhoto from '@tf-app/features/download-photo/download-photo.vue'

import ToggleFavoritePhoto from '@tf-app/features/toggle-favorite-photo/toggle-favorite-photo.vue'
import TfBlurhashImage from '@tf-app/shared/ui/data-display/tf-blurhash-image/tf-blurhash-image.vue'
import { ref } from 'vue'
import type { Photo } from '@tf-app/shared/api'

defineProps<{ photo: Photo }>()

const isActionsVisible = ref(false)

function toggleActions() {
  isActionsVisible.value = !isActionsVisible.value
}
</script>

<template>
  <article :class="classes.photoCard" @mouseenter="toggleActions" @mouseleave="toggleActions">
    <TfBlurhashImage
      :id="photo.id"
      :blurhash="photo.blur_hash"
      :blurhash-width="440"
      :blurhash-height="440"
      :src="`${photo.urls.raw}&w=640&h=640&dpr=2&q=80`"
      :alt="photo.alt_description"
      :srcset="`${photo.urls.raw}&w=320&h=320&dpr=1&q=80 320w, ${photo.urls.raw}&w=640&h=640&dpr=2&q=80 640w, ${photo.urls.raw}&w=1024&h=1024dpr=3&q=80 1024w`"
      sizes="(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px"
      :class="classes.photo"
    />
    <RouterLink :to="`/${photo.id}`" :class="classes.photoLink" :title="photo.alt_description" />
    <Transition name="fade">
      <div v-if="isActionsVisible" :class="classes.overlay" data-testid="photo-actions-overlay" />
    </Transition>
    <div v-if="isActionsVisible" :class="classes.actions">
      <ToggleFavoritePhoto :photo="photo" />
      <DownloadPhoto :src="photo.urls.full" :name="photo.id" />
    </div>
  </article>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.1s ease-in-out,
    visibility 0.1s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  visibility: hidden;
}
</style>

<style module="classes">
.photoCard {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-small);
  z-index: 1;
  height: 440px;
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

@media screen and (width <= 376px) {
  .photoCard {
    height: 320px;
  }
}
</style>
