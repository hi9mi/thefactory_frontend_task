<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useCssModule } from 'vue'

import DecodeWorker from './decode.worker.ts?worker'

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  blurhash: string
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

const worker = new DecodeWorker()

const loading = ref(true)
const canvasElement = ref<HTMLCanvasElement>()
const $classes = useCssModule('classes')
const imageClasses = computed(() => loading.value ? [$classes.image, $classes.loading] : [$classes.image])

onMounted(() => {
  worker.postMessage({ payload: { blurhash: props.blurhash, width: props.blurhashWidth, height: props.blurhashHeight } })
  worker.addEventListener('message', createBlurhashImage)
})

onBeforeUnmount(() => {
  worker.removeEventListener('message', createBlurhashImage)
})

function onLoadImage() {
  loading.value = false
}

function createBlurhashImage(event: MessageEvent<{ payload: { pixels: Uint8ClampedArray } }>) {
  const pixels = event.data.payload.pixels
  if (!canvasElement.value)
    return
  const ctx = canvasElement.value.getContext('2d')
  if (!ctx)
    return

  const imageData = ctx.createImageData(props.blurhashWidth, props.blurhashHeight)
  imageData.data.set(pixels)
  ctx.putImageData(imageData, 0, 0)
}
</script>

<template>
  <canvas v-if="loading" ref="canvasElement" :class="$classes.blur" />
  <img
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
}
</style>
