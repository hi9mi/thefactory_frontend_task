<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useGalleryStore } from '@tf-app/entities/gallery'
import { SearchPhotos } from '@tf-app/features/search-photos'
import { TfLoader } from '@tf-app/shared/ui'
import { TfPhotoCard } from '@tf-app/widgets/tf-photo-card'

const TfAffix = defineAsyncComponent(async () => {
  const module = await import('@tf-app/shared/ui/overlays/tf-affix')
  return module.TfAffix
})
const TfPagination = defineAsyncComponent(async () => {
  const module = await import('@tf-app/shared/ui/navigation/tf-pagination')
  return module.TfPagination
})

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
  <div class="container" :class="classes.galleryContainer">
    <section
      v-if="!isLoadingGallery"
      :class="classes.gallery"
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
          :class="classes.galleryEmpty"
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
      :disabled="isLoadingGallery"
      @next-page="handleNextPage"
      @prev-page="handlePrevPage"
    />

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

.galleryEmpty {
  font-size: 18px;
  text-align: center;
  display: grid;
  grid-column: 2;
  grid-row: 1;
  grid-template-columns: subgrid;
  place-self: center center;
}

@media screen and (width <= 760px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 60px;
  }

  .galleryEmpty {
    grid-column: span 2;
  }
}

@media screen and (width <= 560px) {
  .gallery {
    grid-template-columns: repeat(1, 1fr);
  }

  .galleryEmpty {
    grid-column: 1;
  }

}
</style>
