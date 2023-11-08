<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import VueInlineSvg from 'vue-inline-svg'

import xMarkIcon from '@tf-app/shared/assets/icons/x-mark.svg'
import { useFocusTrap } from '@tf-app/shared/libs'
import { TfActionButton } from '@tf-app/shared/ui'

const props = defineProps<{
  isShow: boolean
  url: string
  description?: string
}>()

const emit = defineEmits<{
  (e: 'hideFullPhoto'): void
}>()

const FULL_PHOTO_CONTAINER_ID = 'full-photo'

const { trapRef } = useFocusTrap()

const fullPhotoContainer = document.createElement('div')
fullPhotoContainer.id = FULL_PHOTO_CONTAINER_ID
document.body.appendChild(fullPhotoContainer)
onMounted(() => {
  document.addEventListener('keydown', handleHideFullPhoto)
})
onBeforeUnmount(() => {
  (fullPhotoContainer && document.body.removeChild(fullPhotoContainer))

  document.removeEventListener('keydown', handleHideFullPhoto)
})

function handleHideFullPhoto(event: MouseEvent | KeyboardEvent) {
  if (event instanceof KeyboardEvent)
    event.key === 'Escape' && emit('hideFullPhoto')
  else
    emit('hideFullPhoto')
}

function handleOverlayKeyDown(event: KeyboardEvent) {
  event.key === ' ' && emit('hideFullPhoto')
}

watch(() => props.isShow, (isShowFullPhoto) => {
  document.body.classList.toggle('hidden', isShowFullPhoto)
})
</script>

<template>
  <Teleport :to="`#${FULL_PHOTO_CONTAINER_ID}`">
    <div
      v-if="isShow"
      ref="trapRef"
      :class="classes.wrapper"
    >
      <div
        :class="classes.overlay"
        role="button"
        tabindex="0"
        @keydown="handleOverlayKeyDown"
        @click="handleHideFullPhoto"
      />
      <img
        :src="url"
        :alt="description"
        :class="classes.photo"
      >
      <TfActionButton
        :class="classes.closeBtn"
        @click="handleHideFullPhoto"
      >
        <VueInlineSvg
          :src="xMarkIcon"
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

.photoWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 102;
  height: min-content;
  max-height: 100%;
  width: 100%;

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
}
</style>
