<script setup lang="ts">
import { GALLERY_RANDOM_STORE_TOKEN } from '@tf-app/entities/gallery'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import TMasonryGrid from '@tf-app/widgets/tf-masonry-grid/tf-masonry-grid.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { defineAsyncComponent, onMounted, watch } from 'vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)

const notify = useDependency(NOTIFIER_TOKEN)
const galleryRandomStore = useDependency(GALLERY_RANDOM_STORE_TOKEN)

const BATCH = 18

onMounted(() => {
  galleryRandomStore.fetchPhotos(BATCH)
})

watch(() => galleryRandomStore.error, (err) => {
  if (err)
    notify.error(err, 'Failed load photos')
})
</script>

<template>
  <SearchPhotosForm data-testid="search-photos-form" mode="navigate" />
  <div class="container" :class="classes.galleryContainer">
    <TMasonryGrid
      :items="galleryRandomStore.items"
      :loading="galleryRandomStore.loading"
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
