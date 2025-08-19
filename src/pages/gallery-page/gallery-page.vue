<script setup lang="ts">
import { createGalleryEntity, createGalleryGateway, GALLERY_CACHE } from '@tf-app/entities/gallery'

import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { TOKENS, useDependency } from '@tf-app/shared/di'
import TfPhotoCardSkeleton from '@tf-app/widgets/tf-photo-card/tf-photo-card-skeleton.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { defineAsyncComponent, onMounted, watch } from 'vue'

const api = useDependency(TOKENS.UnsplashAPI)
const notify = useDependency(TOKENS.Notifier)
const cache = useDependency(GALLERY_CACHE)
const gallery = createGalleryEntity({ gateway: createGalleryGateway(api), cache })
const { random, randomLoading, randomError } = gallery

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)

onMounted(() => {
  gallery.ensureRandom(9)
})
watch(randomError, (err) => {
  if (err)
    notify.error('Error loading photos')
})
</script>

<template>
  <SearchPhotosForm data-testid="search-photos-form" mode="navigate" />
  <div class="container" :class="classes.galleryContainer">
    <section
      :class="classes.gallery"
    >
      <template v-if="randomLoading">
        <TfPhotoCardSkeleton v-for="i of 9" :key="i" data-testid="photo-skeleton" />
      </template>
      <template v-else>
        <TfPhotoCard
          v-for="photo of random"
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
