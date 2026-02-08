<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'

interface Props extends /* @vue-ignore */ Omit<ImgHTMLAttributes, 'alt' | 'loading' | 'decoding'> {
  alt: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto'
}
withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  decoding: 'async',
})
</script>

<template>
  <img v-bind="$props" :alt="alt">
</template>
