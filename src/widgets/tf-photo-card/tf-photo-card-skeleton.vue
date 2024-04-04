<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import TfSkeleton from '@tf-app/shared/ui/feedback/tf-skeleton/tf-skeleton.vue'

const height = ref(440)

const mql = window.matchMedia('(max-width: 376px)')

function onResize() {
  if (mql.matches)
    height.value = 320
  else
    height.value = 440
}

onMounted(() => {
  onResize()

  mql.addEventListener('change', onResize)
})

onBeforeUnmount(() => {
  mql.removeEventListener('change', onResize)
})
</script>

<template>
  <TfSkeleton type="block" :height="height" radius="var(--border-radius-sm)" />
</template>
