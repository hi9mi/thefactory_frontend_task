<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import { useGalleryStore } from '@tf-app/entities/gallery'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { routes } from '@tf-app/routing'
import TfLoader from '@tf-app/shared/ui/feedback/tf-loader/tf-loader.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)

const router = useRouter()
const galleryStore = useGalleryStore()

if (!galleryStore.randomPhotos.length)
  galleryStore.fetchRandomPhotos()

function onSubmitSearchForm(searchTerm: string) {
  router.push({ path: routes.search.path, query: { q: searchTerm, p: 1 } })
}
</script>

<template>
  <SearchPhotosForm @submit="onSubmitSearchForm" />
  <div class="container" :class="classes.galleryContainer">
    <section
      v-if="!galleryStore.isLoadingRandomPhotos"
      :class="classes.gallery"
    >
      <TfPhotoCard
        v-for="photo of galleryStore.randomPhotos"
        :key="photo.id"
        :photo="photo"
      />
    </section>
    <TfLoader v-else />
    <TfAffix />
  </div>
</template>

<style module="classes">
.galleryContainer {
  padding-bottom: 40px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  grid-gap: 40px;
  margin-top: 100px;
  margin-bottom: 40px;
}

@media screen and (width <= 760px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 60px;
  }
}

@media screen and (width <= 560px) {
  .gallery {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
