<script setup lang="ts">
import type { PhotoListItem } from '@tf-app/entities/photo'
import { PHOTO_DETAILS_STORE_TOKEN } from '@tf-app/entities/photo'
import DownloadPhoto from '@tf-app/features/download-photo/download-photo.vue'
import ToggleFavoritePhoto from '@tf-app/features/toggle-favorite-photo/toggle-favorite-photo.vue'
import { useDependency } from '@tf-app/shared/libs'
import TfBlurhashImage from '@tf-app/shared/ui/data-display/tf-blurhash-image/tf-blurhash-image.vue'
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{ photo: PhotoListItem }>()
const timerId = ref<ReturnType<typeof setTimeout>>()
const photoDetailsStore = useDependency(PHOTO_DETAILS_STORE_TOKEN)

const srcset = computed(() => {
  const base = props.photo.urlRaw
  return [
    `${base}&w=440&h=440&q=80 440w`,
    `${base}&w=880&h=880&q=80 880w`,
    `${base}&w=1320&h=1320&q=75 1320w`,
  ].join(', ')
})
const sizes = '(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, min(440px, 25vw)'

function startPrefetch() {
  timerId.value = setTimeout(() => {
    photoDetailsStore.prefetch(props.photo.id)
  }, 300)
}

function cancelPrefetch() {
  clearTimeout(timerId.value)
}

onBeforeUnmount(() => {
  clearTimeout(timerId.value)
})
// TODO: move photo card to entities/photo/ui/photo-card/photo-card.vue
// add slot for actions
// make prop loading and create photo card skeleton
</script>

<template>
  <article
    :class="classes.photoCard"
    :style="{
      '--bg-image': `url(${photo.urlSmall})`,
    }"
  >
    <TfBlurhashImage
      :id="photo.id"
      :blurhash="photo.blurHash ?? null"
      :blurhash-width="440"
      :blurhash-height="440"
      :src="`${photo.urlRaw}&w=440&h=440&q=80`"
      :alt="photo.alt"
      :srcset="srcset"
      :sizes="sizes"
      :class="classes.photo"
      :width="440"
      :height="440"
      fetchpriority="high"
    />
    <RouterLink
      :to="`/photo/${photo.id}`"
      :class="classes.photoLink"
      :title="photo.alt"
      @mouseenter="startPrefetch"
      @mouseleave="cancelPrefetch"
      @focusin="startPrefetch"
      @focusout="cancelPrefetch"
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
  border-radius: var(--border-radius-small);
  z-index: 1;
  display: grid;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
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
  object-fit: contain;
  width: 100%;
  height: unset;
  aspect-ratio: 1;
  backdrop-filter: blur(8px) brightness(0.8) contrast(0.7);
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
