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

const { trapRef } = useFocusTrap()

onMounted(() => {
  document.addEventListener('keydown', handleHideFullPhoto)
})
onBeforeUnmount(() => {
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
  isShowFullPhoto ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'initial')
})
</script>

<template>
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
      type="button"
      :class="classes.closeBtn"
      @click="handleHideFullPhoto"
    >
      <VueInlineSvg
        :src="xMarkIcon"
        aria-label="Закрыть"
        width="24"
        height="24"
      />
    </TfActionButton>
  </div>
</template>

<style module="classes">
.wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgb(0 0 0 / 50%);
  cursor: pointer;
}

.photo {
  width: auto;
  height: 100%;
  object-fit: contain;
  object-position: center;
  z-index: 100;
}

.closeBtn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  color: var(--c-white);
}
</style>
