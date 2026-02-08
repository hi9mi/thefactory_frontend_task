<script setup lang="ts">
import TfImageViewer from '@tf-app/shared/ui/overlays/tf-image-viewer/tf-image-viewer.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  src: string
  alt: string
  open: boolean
  ariaLabel?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const route = useRoute('/photo/[id]')
const scrollTop = ref(0)

watch(() => props.open, (open) => {
  if (open) {
    scrollTop.value = window.scrollY
    document.documentElement.style.top = `-${scrollTop.value}px`
    document.documentElement.classList.add('lock-scrollbar')
  }
  else {
    document.documentElement.classList.remove('lock-scrollbar')
    document.documentElement.style.top = ''

    globalThis.requestAnimationFrame(() => {
      globalThis.scrollTo({ top: scrollTop.value, left: 0, behavior: 'instant' })
    })
  }
}, {
  immediate: true,
})

function closeFullScreenPhoto() {
  emit('close')
  const { full, ...rest } = route.query
  router.push({ query: rest })
}
</script>

<template>
  <TfImageViewer
    :open="open"
    :src="src"
    :alt="alt"
    :aria-label="ariaLabel"
    @close="closeFullScreenPhoto"
  />
</template>
