<script setup lang="ts">
import type { ObjectDirective } from 'vue'
import { computed, ref, useCssModule } from 'vue'

const props = defineProps<{ originalSrc: string; placeholderSrc: string; srcSet: string; sizes: string }>()
const shouldBlurImg = ref(true)
const classes = useCssModule('classes')
const imageClasses = computed(() => shouldBlurImg.value ? [classes.image, classes.blur] : [classes.image])

function loadImage(imgElement: HTMLImageElement) {
  imgElement.src = props.placeholderSrc

  const img = new Image()
  img.srcset = props.srcSet
  img.sizes = props.sizes
  img.src = props.originalSrc

  img.onload = () => {
    imgElement.srcset = props.srcSet
    imgElement.sizes = props.sizes
    imgElement.src = props.originalSrc
    shouldBlurImg.value = false
    img.onload = null
  }
  img.remove()
}

let observer: IntersectionObserver
const vLazy: ObjectDirective<HTMLImageElement, void> = {
  mounted(el) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry && entry.isIntersecting) {
          loadImage(el)
          observer.disconnect()
        }
      })
    }, {
      rootMargin: '50px 0px 0px 0px',
    })

    observer.observe(el)
  },
  beforeUnmount(el) {
    observer.unobserve(el)
  },
}
</script>

<template>
  <img
    v-lazy
    :class="imageClasses"
  >
</template>

<style module="classes">
.image {
  object-fit: cover;
  object-position: center;
  width: 100%;
  transition: filter 0.3s linear;
  filter: blur(0);
}

.blur {
  filter: blur(5px);
}
</style>
