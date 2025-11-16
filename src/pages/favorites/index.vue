<script setup lang="ts">
import { FAVORITES_STORE_TOKEN } from '@tf-app/entities/favorite-photos'
import { useDependency, usePaginationData } from '@tf-app/shared/libs'
import TfMasonryGrid from '@tf-app/widgets/tf-masonry-grid/tf-masonry-grid.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { useRouteQuery } from '@vueuse/router'
import { defineAsyncComponent } from 'vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)
const TfPagination = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/navigation/tf-pagination/tf-pagination.vue'),
)

const BATCH = 18

const favoritesStore = useDependency(FAVORITES_STORE_TOKEN)
const qPage = useRouteQuery('page', 1, { mode: 'push', transform: Number })
const { data: paginatedFavoritePhotos, totalPages } = usePaginationData(() => favoritesStore.items, { currentPage: qPage, limit: BATCH })
</script>

<template>
  <div class="container" :class="classes.container">
    <h1 :class="classes.title">
      Favorites
    </h1>
    <TfMasonryGrid
      :items="paginatedFavoritePhotos"
      :loading="false"
      :skeleton-count="BATCH"
      :initial-items-count="BATCH"
      :max-cols="6"
      :get-aspect-ratio="(p) => (p.w && p.h ? p.w / p.h : undefined)"
    >
      <template #default="{ item }">
        <TfPhotoCard
          data-testid="photo-card"
          :photo="item"
        />
      </template>
    </TfMasonryGrid>
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
}

.favoritesEmpty {
  font-size: 18px;
  text-align: center;
}

@container gallery (max-width: 1024px) {
  .title {
    font-size: 64px;
    margin: 80px 0;
  }
}

@container gallery (max-width: 760px) {
  .title {
    font-size: 56px;
    margin: 70px 0;
  }
}

@container gallery (max-width: 560px) {
  .title {
    font-size: 36px;
    margin: 50px 0;
  }
}
</style>
