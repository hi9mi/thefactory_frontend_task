<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, useCssModule } from 'vue'

import { decodeWorker } from './decode'

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  id: string
  blurhash: string | null
  src: string
  srcset?: string
  sizes?: string
  alt?: string
  blurhashWidth?: number
  blurhashHeight?: number
}>(), {
  blurhashWidth: 128,
  blurhashHeight: 128,
})
const loading = ref(true)
const canvasElement = ref<HTMLCanvasElement>()
const $classes = useCssModule('classes')
const imageClasses = computed(() => loading.value ? [$classes.image, $classes.loading] : [$classes.image])

onMounted(() => {
  decodeWorker.postMessage({ payload: { blurhash: props.blurhash, width: props.blurhashWidth, height: props.blurhashHeight, id: props.id } })
  decodeWorker.addEventListener('message', handleBlurhashImage)
})

onBeforeUnmount(() => {
  decodeWorker.removeEventListener('message', handleBlurhashImage)
})

function onLoadImage() {
  loading.value = false
}

function handleBlurhashImage(event: MessageEvent<{ payload: { bitmap: ImageBitmap, id: string } }>) {
  const { bitmap, id } = event.data.payload
  if (id !== props.id)
    return

  const ctx = canvasElement.value?.getContext('2d')
  if (!ctx)
    return

  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
}
</script>

<template>
  <canvas v-if="loading" ref="canvasElement" :class="$classes.blur" />
  <img
    v-show="!loading"
    :src="src"
    :srcset="srcset"
    :sizes="sizes"
    :alt="alt"
    :class="imageClasses"
    v-bind="$attrs"
    @load="onLoadImage"
  >
</template>

<style module="classes">
.image {
  display: block;
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: auto;
}

.loading {
  position: absolute;
  z-index: -1;
  height: 0;
  width: 0;
}

.blur {
  display: block;
  height: 100%;
  width: 100%;
  background-color: var(--c-weathered-stone);
}
</style>
