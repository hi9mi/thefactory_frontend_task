<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useGalleryStore } from '@tf-app/entities/gallery'
import SearchPhotos from '@tf-app/features/search-photos/search-photos.vue'
import TfLoader from '@tf-app/shared/ui/tf-loader.vue'
import TfPagination from '@tf-app/shared/ui/tf-pagination.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card.vue'

const TfAffix = defineAsyncComponent(() => import('@tf-app/shared/ui/tf-affix.vue'))

const router = useRouter()
const route = useRoute()
const galleryStore = useGalleryStore()
const { randomPhotos, isLoadingGallery, photos } = storeToRefs(galleryStore)
const page = ref(Number(route.query.p) || 1)

function handleNextPage(newPage: number) {
  page.value = newPage
  router.push({ replace: true, path: route.path, query: { ...route.query, p: newPage } })
  galleryStore.getPhotos(route.query.q as string, newPage)
}
function handlePrevPage(newPage: number) {
  page.value = newPage
  router.push({ replace: true, path: route.path, query: { ...route.query, p: newPage } })
  galleryStore.getPhotos(route.query.q as string, newPage)
}

watch(() => route.query.p, () => {
  page.value = Number(route.query.p)
})
</script>

<template>
  <SearchPhotos />
  <div class="container gallery-container">
    <section
      v-if="!isLoadingGallery"
      class="gallery"
    >
      <template v-if="photos">
        <template v-if="photos.total > 0">
          <TfPhotoCard
            v-for="photo of photos.results"
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
    <TfPagination
      v-if="photos?.total"
      :total-pages="photos.total_pages"
      :page="page"
      @next-page="handleNextPage"
      @prev-page="handlePrevPage"
    />
    <TfAffix />
  </div>
</template>

<style scoped>
.gallery-container {
  padding-bottom: 40px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(auto, 1fr);
  grid-gap: 20px;
  margin-top: 100px;
  margin-bottom: 40px;
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
