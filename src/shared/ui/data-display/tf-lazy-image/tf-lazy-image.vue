<script setup lang="ts">
import { computed, useCssModule } from 'vue'

import { useLazyImage } from './libs'

withDefaults(defineProps<{
  originalSrc: string
  placeholderSrc: string
  srcset?: string
  sizes?: string
  alt?: string
  intersectionOptions?: IntersectionObserverInit
}>(), {
  intersectionOptions: () => ({
    root: null,
    rootMargin: '100px 0px 100px 0px',
    threshold: 0,
  }),
})
const emit = defineEmits<{
  loaded: [element: HTMLImageElement]
  intersected: [element: HTMLImageElement]
  error: [element: HTMLImageElement]
}>()

const { vLazy, state } = useLazyImage()
const classes = useCssModule('classes')

const imageClasses = computed(() => state.isLoading ? [classes.image, classes.loading] : [classes.image])

function onIntersect(element: HTMLImageElement) {
  emit('intersected', element)
}
function onLoad(element: HTMLImageElement) {
  emit('loaded', element)
}
function onError(element: HTMLImageElement) {
  emit('error', element)
}
</script>

<template>
  <img
    v-lazy="{
      originalSrc,
      placeholderSrc,
      srcset,
      sizes,
      alt,
      intersectionOptions,
      onLoad,
      onIntersect,
      onError,
    }"
    :class="imageClasses"
  >
</template>

<style module="classes">
.image {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: auto;
  transition: filter 0.3s linear;
  filter: blur(0);
}

.loading {
  filter: blur(5px);
}
</style>
