<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'

import { useFavoritePhotosStore } from '@tf-app/entities/favorite-photos'
import { usePagination } from '@tf-app/shared/libs'
import { TfPagination } from '@tf-app/shared/ui'
import { TfPhotoCard } from '@tf-app/widgets/tf-photo-card'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)

const favoritePhotosStore = useFavoritePhotosStore()
const { favoritePhotos } = storeToRefs(favoritePhotosStore)
const { data: paginatedFavoritePhotos, currentPage, onNextPage, onPreviousPage, totalPages } = usePagination(favoritePhotos)
</script>

<template>
  <div class="container">
    <h1 :class="classes.title">
      Избранное
    </h1>
    <section
      v-if="paginatedFavoritePhotos.length > 0"
      :class="classes.gallery"
    >
      <TfPhotoCard
        v-for="favPhoto of paginatedFavoritePhotos"
        :key="favPhoto.id"
        :photo="favPhoto"
      />
    </section>
    <p
      v-else
      :class="classes.favoritesEmpty"
    >
      В избранном пусто...
    </p>
    <TfPagination
      v-if="totalPages > 0"
      :total-pages="totalPages"
      :page="currentPage"
      @next-page="onNextPage"
      @prev-page="onPreviousPage"
    />
    <TfAffix />
  </div>
</template>

<style module="classes">
.title {
  font-size: 72px;
  font-weight: 700;
  text-align: center;
  margin: 100px 0;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  grid-gap: 40px;
  margin: 100px 0;
}

.favoritesEmpty {
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
  }

  .title {
    font-size: 56px;
    margin: 70px 0;
  }

  .favoritesEmpty {
    grid-column: span 2;
  }
}

@media screen and (width <= 560px) {
  .title {
    font-size: 36px;
    margin: 50px 0;
  }

  .gallery {
    grid-template-columns: repeat(1, 1fr);
  }

  .favoritesEmpty {
    grid-column: 1;
  }
}
</style>
