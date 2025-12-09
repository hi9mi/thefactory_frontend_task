<script setup lang="ts">
import { RANDOM_FEED_STORE_TOKEN } from '@tf-app/entities/photo'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import TfSkeleton from '@tf-app/shared/ui/feedback/tf-skeleton/tf-skeleton.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { computed, defineAsyncComponent, onMounted, watch } from 'vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)

const notify = useDependency(NOTIFIER_TOKEN)
const galleryRandomStore = useDependency(RANDOM_FEED_STORE_TOKEN)

const BATCH = 30

onMounted(() => {
  galleryRandomStore.fetchPhotos(BATCH)
})

watch(() => galleryRandomStore.error, (err) => {
  if (err)
    notify.error(err, 'Failed load photos')
})

const showGrid = computed(() => !galleryRandomStore.loading && galleryRandomStore.items.length > 0)
</script>

<template>
  <SearchPhotosForm data-testid="search-photos-form" mode="navigate" />
  <div class="container" :class="classes.galleryContainer">
    <div class="gallery-grid">
      <template v-if="showGrid">
        <TfPhotoCard v-for="item in galleryRandomStore.items" :key="item.id" :photo="item" data-testid="photo-card" />
      </template>
      <template v-else-if="galleryRandomStore.loading">
        <TfSkeleton v-for="item in BATCH" :key="item" :aspect-ratio="1" />
      </template>
    </div>
    <TfAffix data-testid="affix" />
  </div>
</template>

<style module="classes">
.galleryContainer {
  container: gallery / inline-size;
}
</style>
