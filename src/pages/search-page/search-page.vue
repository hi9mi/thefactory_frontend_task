<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue'

import { useGalleryStore } from '@tf-app/entities/gallery'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import TfPhotoCardSkeleton from '@tf-app/widgets/tf-photo-card/tf-photo-card-skeleton.vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)
const TfPagination = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/navigation/tf-pagination/tf-pagination.vue'),
)

const galleryStore = useGalleryStore()

async function onSubmitSearchForm(searchTerm: string) {
  galleryStore.changeSearchTerm(searchTerm)
  galleryStore.changeCurrentPage(1)
}

watch(() => [galleryStore.page, galleryStore.searchTerm], (
  newValue,
  oldValue,
) => {
  if (newValue[0] === oldValue?.[0] && newValue[1] === oldValue?.[1])
    return

  galleryStore.fetchPhotos()
}, {
  immediate: true,
})
</script>

<template>
  <SearchPhotosForm @submit="onSubmitSearchForm" />
  <div class="container" :class="classes.galleryContainer">
    <section
      :class="classes.gallery"
    >
      <template v-if="galleryStore.isLoadingPhotos">
        <TfPhotoCardSkeleton v-for="i of 9" :key="i" />
      </template>
      <template v-else-if="galleryStore.hasPhotos">
        <TfPhotoCard
          v-for="photo of galleryStore.photos!.results"
          :key="photo.id"
          :photo="photo"
        />
      </template>
      <p
        v-else-if="galleryStore.hasNoResults"
        :class="classes.galleryEmpty"
      >
        По вашему запросу не найдено фотографий
      </p>
      <p
        v-else-if="galleryStore.isSearchEmpty"
        :class="classes.galleryEmpty"
      >
        Для того чтобы найти фотографии, введите запрос
      </p>
    </section>
    <TfPagination
      v-if="galleryStore.hasPhotos"
      :total-pages="galleryStore.photos!.total_pages"
      :page="galleryStore.page"
      :disabled="galleryStore.isLoadingPhotos"
      @change-page="galleryStore.changeCurrentPage"
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
