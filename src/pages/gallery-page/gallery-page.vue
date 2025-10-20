<script setup lang="ts">
import { createGalleryEntity, createGalleryGateway } from '@tf-app/entities/gallery'

import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { UNSPLASH_API_TOKEN } from '@tf-app/shared/api'
import { TOKENS, useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import TMasonryGrid from '@tf-app/widgets/tf-masonry-grid/tf-masonry-grid.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { defineAsyncComponent, onMounted, onScopeDispose, shallowRef, watch } from 'vue'

const api = useDependency(UNSPLASH_API_TOKEN)
const notify = useDependency(NOTIFIER_TOKEN)
const lru = useDependency(TOKENS.LRUCache)
const gallery = createGalleryEntity({ gateway: createGalleryGateway(api), lru })
const { random, randomLoading, randomError } = gallery
const controller = shallowRef<AbortController | null>(null)

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)

const BATCH = 18

onMounted(() => {
  controller.value?.abort()
  controller.value = new AbortController()
  gallery.ensureRandom(BATCH, { signal: controller.value.signal })
})

onScopeDispose(() => {
  controller.value?.abort()
})

watch(randomError, (err) => {
  if (err)
    notify.error(err, 'Failed load photos')
})
</script>

<template>
  <SearchPhotosForm data-testid="search-photos-form" mode="navigate" />
  <div class="container" :class="classes.galleryContainer">
    <TMasonryGrid
      :items="random"
      :loading="randomLoading"
      :skeleton-count="BATCH"
      :initial-items-count="BATCH"
      :max-cols="6"
      :get-aspect-ratio="(p) => (p.w && p.h ? p.w / p.h : undefined)"
    >
      <template #default="{ item }">
        <TfPhotoCard :photo="item" data-testid="photo-card" />
      </template>
    </TMasonryGrid>
    <TfAffix data-testid="affix" />
  </div>
</template>

<style module="classes">
.galleryContainer {
  container: gallery / inline-size;
}
</style>
