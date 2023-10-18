<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'

import { useGalleryStore } from '@tf-app/entities/gallery'
import SearchPhotos from '@tf-app/features/search-photos/search-photos.vue'
import TfLoader from '@tf-app/shared/ui/tf-loader.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card.vue'

const TfAffix = defineAsyncComponent(() => import('@tf-app/shared/ui/tf-affix.vue'))

const galleryStore = useGalleryStore()
const { randomPhotos, isLoadingGallery, photos } = storeToRefs(galleryStore)
</script>

<template>
  <SearchPhotos />
  <div class="container">
    <section
      v-if="!isLoadingGallery"
      class="gallery"
    >
      <template v-if="photos">
        <template v-if="photos.length > 0">
          <TfPhotoCard
            v-for="photo of photos"
            :key="photo.id"
            :photo="photo"
          />
        </template>
        <p
          v-else
          class="gallery-empty"
        >
          По вашему запросу не найдено фотографий
        </p>
      </template>
      <template v-else>
        <TfPhotoCard
          v-for="photo of randomPhotos"
          :key="photo.id"
          :photo="photo"
        />
      </template>
    </section>
    <TfLoader v-else />
    <TfAffix />
  </div>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 20px;
  margin-top: 100px;
}

.gallery-empty {
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
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
