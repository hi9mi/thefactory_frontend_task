<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps<{
  isShow: boolean
  url: string
  description?: string
}>()
const emit = defineEmits<{
  (e: 'hideFullPhoto'): void
}>()

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

watch(() => props.isShow, (isShowFullPhoto) => {
  isShowFullPhoto ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'initial')
})
</script>

<template>
  <div
    v-if="isShow"
    class="full-photo-wrapper"
  >
    <div class="full-photo-overlay" @click="handleHideFullPhoto" />
    <img
      :src="url"
      :alt="description"
      class="full-photo"
    >
  </div>
</template>

<style scoped>
.full-photo-wrapper {
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

.full-photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgb(0 0 0 / 50%);
  cursor: pointer;
}

.full-photo {
  position: relative;
  width: auto;
  height: 100%;
  object-fit: contain;
  object-position: center;
  z-index: 100;
}
</style>
