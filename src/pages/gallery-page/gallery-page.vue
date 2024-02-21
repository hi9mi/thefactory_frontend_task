<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useGalleryStore } from '@tf-app/entities/gallery'
import { SearchPhotos } from '@tf-app/features/search-photos'
import { TfLoader } from '@tf-app/shared/ui'
import { TfPhotoCard } from '@tf-app/widgets/tf-photo-card'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)
const TfPagination = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/navigation/tf-pagination/tf-pagination.vue'),
)

const galleryStore = useGalleryStore()
const { randomPhotos, isLoadingRandomPhotos, photos, currentPage } = storeToRefs(galleryStore)
const route = useRoute()

const shouldShowPhotos = computed(() => {
  if (!photos.value)
    return false

  return photos.value.total > 0
})

const shouldShowEmptyText = computed(() => {
  const searchQuery = route.query.q as string
  if (!searchQuery || !photos.value)
    return false

  return photos.value.total < 1 && searchQuery.trim().length > 1
})

function onChangeSearch(value: string) {
  currentPage.value = 1
  if (value.trim().length < 1)
    photos.value = null
}
</script>

<template>
  <SearchPhotos @change="onChangeSearch" />
  <div class="container" :class="classes.galleryContainer">
    <section
      v-if="!isLoadingRandomPhotos"
      :class="classes.gallery"
    >
      <template v-if="shouldShowPhotos">
        <TfPhotoCard
          v-for="photo of photos!.results"
          :key="photo.id"
          :photo="photo"
        />
      </template>
      <p
        v-else-if="shouldShowEmptyText"
        :class="classes.galleryEmpty"
      >
        По вашему запросу не найдено фотографий
      </p>
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
      v-if="shouldShowPhotos"
      :total-pages="photos!.total_pages"
      :page="currentPage"
      @next-page="galleryStore.changeCurrentPage"
      @prev-page="galleryStore.changeCurrentPage"
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
