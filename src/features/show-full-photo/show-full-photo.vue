<script setup lang="ts">
import { routes } from '@tf-app/routing'
import { useFocusTrap } from '@tf-app/shared/libs'

import TfActionButton from '@tf-app/shared/ui/buttons/tf-action-button/tf-action-button.vue'
import XMarkIcon from '~icons/tf-icons/x-mark'
import { onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Photo } from '@tf-app/shared/api'

defineOptions({
  inheritAttrs: false,
})
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
const scrollTop = window.scrollY

const fullPhotoContainer = document.createElement('div')
fullPhotoContainer.id = FULL_PHOTO_CONTAINER_ID
document.body.appendChild(fullPhotoContainer)

onMounted(() => {
  document.documentElement.style.top = `${-scrollTop}px`
  document.documentElement.classList.add('lock-scrollbar')
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  if (fullPhotoContainer)
    document.body.removeChild(fullPhotoContainer)

  document.documentElement.classList.remove('lock-scrollbar')
  document.documentElement.style.top = ''
  window.scrollTo({ top: scrollTop, left: 0, behavior: 'instant' })
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
  router.replace({
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
      v-bind="$attrs"
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
        data-testid="close-preview-btn"
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
  inset: 0;
  z-index: 100;
  padding: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
  background-color: rgb(0 0 0 / 50%);
  cursor: pointer;
}

.photo {
  position: relative;
  z-index: 102;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.closeBtn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 102;
  color: var(--color-white);
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
