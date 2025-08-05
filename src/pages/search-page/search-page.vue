<script setup lang="ts">
import { useGalleryStore } from '@tf-app/entities/gallery'

import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import TfPhotoCardSkeleton from '@tf-app/widgets/tf-photo-card/tf-photo-card-skeleton.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { defineAsyncComponent, watch } from 'vue'

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
  <SearchPhotosForm data-testid="search-photos-form" @submit="onSubmitSearchForm" />
  <div class="container" :class="classes.galleryContainer">
    <section
      :class="classes.gallery"
    >
      <template v-if="galleryStore.isLoadingPhotos">
        <TfPhotoCardSkeleton v-for="i of 9" :key="i" data-testid="photo-skeleton" />
      </template>
      <template v-else-if="galleryStore.hasPhotos">
        <TfPhotoCard
          v-for="photo of galleryStore.photos!.results"
          :key="photo.id"
          data-testid="photo-card"
          :photo="photo"
        />
      </template>
      <p
        v-else-if="galleryStore.hasNoResults"
        :class="classes.galleryEmpty"
        data-testid="no-results"
      >
        По вашему запросу не найдено фотографий
      </p>
      <p
        v-else-if="galleryStore.isSearchEmpty"
        :class="classes.galleryEmpty"
        data-testid="search-empty"
      >
        Для того чтобы найти фотографии, введите запрос
      </p>
    </section>
    <TfPagination
      v-if="galleryStore.hasPhotos"
      :total-pages="galleryStore.photos!.total_pages"
      :page="galleryStore.page"
      :disabled="galleryStore.isLoadingPhotos"
      data-testid="pagination"
      @change-page="galleryStore.changeCurrentPage"
    />

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
