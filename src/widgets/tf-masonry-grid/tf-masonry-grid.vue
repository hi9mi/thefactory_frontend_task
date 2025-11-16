<script setup lang="ts">
import type { PhotoListItem } from '@tf-app/entities/photo'
import TfSkeleton from '@tf-app/shared/ui/feedback/tf-skeleton/tf-skeleton.vue'
import MagicGrid from 'magic-grid'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

const props = withDefaults(defineProps<{
  items: PhotoListItem[]
  loading?: boolean
  skeletonCount?: number
  gutter?: number
  maxCols?: number
  initialItemsCount?: number
  getAspectRatio?: (item: PhotoListItem) => number | undefined
}>(), {
  skeletonCount: 9,
  gutter: 20,
  initialItemsCount: 9,
})

const SKELETON_RATIOS = ['1 / 1', '4 / 3', '3 / 4', '16 / 9', '9 / 16', '5 / 4', '4 / 5']
const containerRef = ref<HTMLElement | null>(null)
const ro = shallowRef<ResizeObserver | null>(null)
const grid = shallowRef<MagicGrid | null>(null)
const rafId = ref(0)

function layoutSoon() {
  cancelAnimationFrame(rafId.value)
  rafId.value = requestAnimationFrame(() => grid.value?.positionItems())
}

onMounted(async () => {
  await nextTick()
  const initialCount
    = (props.loading ? props.skeletonCount : props.items.length) || props.initialItemsCount

  grid.value = new MagicGrid({
    container: containerRef.value!,
    useMin: true,
    gutter: props.gutter,
    maxColumns: props.maxCols,
    animate: true,
    items: initialCount,
  })

  ro.value = new ResizeObserver((entries) => {
    const el = entries[0].target as HTMLElement
    const width = entries[0].contentRect.width
    const gutter = Number.parseFloat(getComputedStyle(el).getPropertyValue('--gutter')) || 20

    const minCol = Number.parseFloat(getComputedStyle(el).getPropertyValue('--col-w')) || 200
    const maxCols = props.maxCols ?? 8

    const cols = Math.max(1, Math.min(maxCols, Math.floor((width + gutter) / (minCol + gutter))))

    el.style.setProperty('--cols', String(cols))

    if (grid.value) {
      grid.value.gutter = gutter
    }
    layoutSoon()
  })

  layoutSoon()
  ro.value.observe(containerRef.value!)
})

onBeforeUnmount(() => {
  ro.value?.disconnect()
  cancelAnimationFrame(rafId.value)
  grid.value = null
})

watch([() => props.items.length, () => props.loading], async () => {
  await nextTick()
  if (grid.value) {
    grid.value.size = props.loading ? props.skeletonCount! : props.items.length
    layoutSoon()
  }
})
</script>

<template>
  <section ref="containerRef" :class="classes.masonry" :aria-busy="!!loading" data-testid="gallery-grid">
    <template v-if="loading">
      <div
        v-for="i in skeletonCount"
        :key="i"
        :class="classes.item"
        :style="{ aspectRatio: SKELETON_RATIOS[(i - 1) % SKELETON_RATIOS.length] }"
      >
        <TfSkeleton type="block" width="100%" height="100%" radius="4px" />
      </div>
    </template>

    <template v-else>
      <div
        v-for="item in items"
        :key="item.id"
        :class="classes.item"
        :style="{
          aspectRatio: (getAspectRatio?.(item) ? String(getAspectRatio(item)) : undefined),
        }"
      >
        <slot :item="item" />
      </div>
    </template>
  </section>
</template>

<style lang="css" module="classes">
.masonry {
  position: relative;
  width: 100%;
  margin: var(--margin, 40px) 0;

  --col-w: 300px;
  --gutter: 24px;
  --margin: 60px;
}

.item {
  width: var(--col-w, 320px);
}

@container gallery (max-width: 1024px) {
  .masonry {
    --gutter: 32px;
    --margin: 80px;
  }
}

@container gallery (max-width: 760px) {
  .masonry {
    --col-w: 300px;
    --gutter: 24px;
    --margin: 60px;
  }
}

@container gallery (max-width: 560px) {
  .masonry {
    --col-w: 280px;
    --gutter: 20px;
    --margin: 20px;
  }
}
</style>
