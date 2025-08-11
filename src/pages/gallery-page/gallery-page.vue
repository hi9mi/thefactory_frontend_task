<script setup lang="ts">
import { createGalleryModel } from '@tf-app/entities/gallery'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'

import { routes } from '@tf-app/routing'
import { TOKENS, useResolver } from '@tf-app/shared/di'
import TfPhotoCardSkeleton from '@tf-app/widgets/tf-photo-card/tf-photo-card-skeleton.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

const resolve = useResolver()
const notifier = resolve(TOKENS.Notifier)
const { useGalleryStore } = createGalleryModel({
  api: resolve(TOKENS.UnsplashAPI),
  notify: notifier,
})

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
  <SearchPhotosForm data-testid="search-photos-form" @submit="onSubmitSearchForm" />
  <button @click="notifier.success('Hello, world!')">
    test notification
  </button>
  <div class="container" :class="classes.galleryContainer">
    <section
      :class="classes.gallery"
    >
      <template v-if="galleryStore.isLoadingRandomPhotos">
        <TfPhotoCardSkeleton v-for="i of 9" :key="i" data-testid="photo-skeleton" />
      </template>
      <template v-else>
        <TfPhotoCard
          v-for="photo of galleryStore.randomPhotos"
          :key="photo.id"
          :photo="photo"
          data-testid="photo-card"
        />
      </template>
    </section>
    <TfAffix data-testid="affix" />
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
