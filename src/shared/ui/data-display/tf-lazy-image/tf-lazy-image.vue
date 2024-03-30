<script setup lang="ts">
import { computed, useCssModule } from 'vue'

import { useLazyImage } from './libs'

defineProps<{ originalSrc: string, placeholderSrc: string, srcset: string, sizes: string }>()

const { vLazy, loading } = useLazyImage()
const classes = useCssModule('classes')

const imageClasses = computed(() => loading.value ? [classes.image, classes.loading] : [classes.image])
</script>

<template>
  <img
    v-lazy="{ originalSrc, placeholderSrc, srcset, sizes }"
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

.loading {
  filter: blur(5px);
}
</style>
