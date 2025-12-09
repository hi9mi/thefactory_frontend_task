<script setup lang="ts">
import { FAVORITE_PHOTO_STORE_TOKEN } from '@tf-app/entities/photo'
import { useDependency, usePaginationData } from '@tf-app/shared/libs'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { useRouteQuery } from '@vueuse/router'
import { defineAsyncComponent } from 'vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)
const TfPagination = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/navigation/tf-pagination/tf-pagination.vue'),
)

const BATCH = 30

const favoritesStore = useDependency(FAVORITE_PHOTO_STORE_TOKEN)
const qPage = useRouteQuery('page', 1, { mode: 'push', transform: Number })
const { data: paginatedFavoritePhotos, totalPages } = usePaginationData(() => favoritesStore.items, { currentPage: qPage, limit: BATCH })
</script>

<template>
  <div class="container" :class="classes.container">
    <h1 :class="classes.title">
      Favorites
    </h1>
    <div class="gallery-grid">
      <template v-if="paginatedFavoritePhotos.length > 0">
        <TfPhotoCard v-for="item in paginatedFavoritePhotos" :key="item.id" :photo="item" data-testid="photo-card" />
      </template>
    </div>
    <p
      v-if="paginatedFavoritePhotos.length < 1"
      :class="classes.favoritesEmpty"
      data-testid="favorites-empty"
    >
      No photos added yet...
    </p>
    <TfPagination
      v-if="paginatedFavoritePhotos.length >= 1"
      :total-pages="totalPages"
      :page="qPage"
      data-testid="pagination"
      @change-page="(p) => qPage = p"
    />
    <TfAffix data-testid="affix" />
  </div>
</template>

<style module="classes">
.title {
  font-size: 72px;
  font-weight: 700;
  text-align: center;
  margin: 100px 0;
}

.container {
  container: gallery / inline-size;
  padding-bottom: 40px;
}

.favoritesEmpty {
  font-size: 18px;
  text-align: center;
}
</style>
