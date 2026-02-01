<script setup lang="ts">
import { RANDOM_FEED_STORE_TOKEN } from '@tf-app/entities/photo'
import PhotoCard from '@tf-app/entities/photo/ui/photo-card/photo-card.vue'
import DownloadPhoto from '@tf-app/features/download-photo/download-photo.vue'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import ToggleFavoritePhoto from '@tf-app/features/toggle-favorite-photo/toggle-favorite-photo.vue'
import { useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
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
        <PhotoCard v-for="item in galleryRandomStore.items" :key="item.id" :photo="item" data-testid="photo-card" :loading="galleryRandomStore.loading">
          <template #actions="photo">
            <ToggleFavoritePhoto :photo="photo" />
            <DownloadPhoto :src="photo.urlRaw ?? ''" :name="photo.id" />
          </template>
        </PhotoCard>
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
