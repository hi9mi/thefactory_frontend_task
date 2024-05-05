<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { routes } from '@tf-app/routing'
import type { Photo } from '@tf-app/shared/api'
import { useFocusTrap } from '@tf-app/shared/libs'
import TfActionButton from '@tf-app/shared/ui/buttons/tf-action-button/tf-action-button.vue'

import XMarkIcon from '~icons/tf-icons/x-mark'

defineProps<{
  photo: Photo
  description?: string
}>()

const emit = defineEmits<{
  hideFullPhoto: []
}>()

const FULL_PHOTO_CONTAINER_ID = 'full-photo'

const { trapRef } = useFocusTrap()
const router = useRouter()
const route = useRoute()

const fullPhotoContainer = document.createElement('div')
fullPhotoContainer.id = FULL_PHOTO_CONTAINER_ID
document.body.appendChild(fullPhotoContainer)
document.body.classList.add('hidden')

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  if (fullPhotoContainer)
    document.body.removeChild(fullPhotoContainer)

  document.body.classList.remove('hidden')
  document.removeEventListener('keydown', handleEscapeKey)
})

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape')
    hideFullPhoto()
}

function handleOverlayKeyDown(event: KeyboardEvent) {
  if (event.key === ' ')
    hideFullPhoto()
}

function hideFullPhoto() {
  emit('hideFullPhoto')
  router.push({
    name: routes.photoPage.name,
    params: {
      id: route.params.id,
    },
  })
}
</script>

<template>
  <Teleport :to="`#${FULL_PHOTO_CONTAINER_ID}`">
    <div
      ref="trapRef"
      :class="classes.wrapper"
    >
      <div
        :class="classes.overlay"
        role="button"
        tabindex="0"
        data-testid="full-photo-overlay"
        @keydown="handleOverlayKeyDown"
        @click="hideFullPhoto"
      />
      <img
        :src="`${photo.urls.raw}&w=640&h=640&dpr=2&q=80`"
        :srcset="`${photo.urls.raw}&w=320&h=320&dpr=1&q=80 320w, ${photo.urls.raw}&w=640&h=640&dpr=2&q=80 640w, ${photo.urls.raw}&w=1024&h=1024dpr=3&q=80 1024w`"
        sizes="(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px"
        :alt="description"
        :class="classes.photo"
      >
      <TfActionButton
        :class="classes.closeBtn"
        @click="hideFullPhoto"
      >
        <XMarkIcon
          width="25"
          height="25"
          aria-label="Закрыть"
        />
      </TfActionButton>
    </div>
  </Teleport>
</template>

<style module="classes">
.wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 60px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
  background-color: rgb(0 0 0 / 50%);
  cursor: pointer;
}

.photo {
  position: relative;
  z-index: 102;
  width: min-content;
  max-width: 1200px;
  max-height: 100%;
  object-fit: contain;
  margin: 0 auto;
}

.closeBtn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 102;
  color: var(--c-white);
}

@media screen and (width <= 678px) {
  .wrapper {
    padding: 20px;
  }

  .photo {
    width: 100%;
  }
}
</style>
