<script setup lang="ts">
import { SEARCH_RESULT_STORE_TOKEN } from '@tf-app/entities/photo'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import TfMasonryGrid from '@tf-app/widgets/tf-masonry-grid/tf-masonry-grid.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { useRouteQuery } from '@vueuse/router'
import { computed, defineAsyncComponent, onMounted, watch } from 'vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)
const TfPagination = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/navigation/tf-pagination/tf-pagination.vue'),
)

const BATCH = 18

const notify = useDependency(NOTIFIER_TOKEN)
const gallerySearchStore = useDependency(SEARCH_RESULT_STORE_TOKEN)

const q = useRouteQuery<string>('q', '', { mode: 'replace' })
const page = useRouteQuery('page', '1', { mode: 'push', transform: Number })

async function onSubmit(query: string) {
  if (!query.trim())
    return

  page.value = 1
  gallerySearchStore.search({ query, page: 1, perPage: BATCH })
}

watch(page, () => {
  if (q.value.trim())
    gallerySearchStore.search({ query: q.value, page: page.value, perPage: BATCH })
})

onMounted(() => {
  if (q.value.trim())
    gallerySearchStore.search({ query: q.value, page: page.value, perPage: BATCH })
})

const showGrid = computed(() => gallerySearchStore.loading || gallerySearchStore.items.items.length > 0)
const hasNoResults = computed(() => gallerySearchStore.items.items.length === 0)
const isSearchEmpty = computed(() => hasNoResults.value && q.value.trim() === '')

watch(() => gallerySearchStore.error, (err) => {
  if (err)
    notify.error(err, 'Failed search photos')
})
</script>

<template>
  <SearchPhotosForm v-model="q" data-testid="search-photos-form" mode="inline" @submit="onSubmit" />

  <div class="container" :class="classes.galleryContainer">
    <TfMasonryGrid
      v-if="showGrid"
      :items="gallerySearchStore.items.items"
      :loading="gallerySearchStore.loading"
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
    <TfPagination
      v-if="gallerySearchStore.items.items.length"
      :total-pages="gallerySearchStore.items.totalPages"
      :page="page"
      :disabled="gallerySearchStore.loading"
      data-testid="pagination"
      @change-page="(p) => page = p"
    />
    <div
      v-if="!gallerySearchStore.loading"
    >
      <p
        v-if="isSearchEmpty"
        :class="classes.galleryEmpty"
        data-testid="search-empty"
      >
        Search empty, try type in search
      </p>
      <p
        v-else-if="hasNoResults"
        :class="classes.galleryEmpty"
        data-testid="no-results"
      >
        Not found photos
      </p>
    </div>
    <TfAffix data-testid="affix" />
  </div>
</template>

<style module="classes">
.galleryContainer {
  container: gallery / inline-size;
}

.galleryEmpty {
  font-size: 18px;
  text-align: center;
}
</style>
