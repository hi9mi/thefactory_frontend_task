<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useGalleryStore } from '@tf-app/entities/gallery'
import TfGallerySearch from '@tf-app/entities/gallery/ui/tf-gallery-search.vue'
import TfAffix from '@tf-app/shared/ui/tf-affix.vue'
import TfLoader from '@tf-app/shared/ui/tf-loader.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card.vue'

const galleryStore = useGalleryStore()
const { randomPhotos, isLoadingGallery, photos, searchQuery } = storeToRefs(galleryStore)

const isEmptySearch = computed(() => searchQuery.value?.trim().length > 0 && photos.value.length < 1)
</script>

<template>
  <TfGallerySearch v-model="searchQuery" />
  <main class="container">
    <div
      v-if="!isLoadingGallery"
      class="gallery"
    >
      <template v-if="searchQuery?.trim().length">
        <p
          v-if="isEmptySearch"
          class="gallery-empty"
        >
          Ничего не найдено
        </p>
        <template v-else>
          <TfPhotoCard
            v-for="photo of photos"
            :key="photo.id"
            :photo="photo"
          />
        </template>
      </template>
      <template v-else>
        <TfPhotoCard
          v-for="photo of randomPhotos"
          :key="photo.id"
          :photo="photo"
        />
      </template>
    </div>
    <TfLoader v-else />
    <TfAffix />
  </main>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 20px;
  margin: 100px 0;
}

.gallery-empty {
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
}

@media screen and (width <= 760px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (width <= 560px) {
  .gallery {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
