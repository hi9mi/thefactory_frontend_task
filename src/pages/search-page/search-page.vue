<script setup lang="ts">
import { createGalleryEntity, createGalleryGateway } from '@tf-app/entities/gallery'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { UNSPLASH_API_TOKEN } from '@tf-app/shared/api'
import { debounce, TOKENS, useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import TfMasonryGrid from '@tf-app/widgets/tf-masonry-grid/tf-masonry-grid.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { useRouteQuery } from '@vueuse/router'
import { computed, defineAsyncComponent, ref, shallowRef, watch } from 'vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)
const TfPagination = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/navigation/tf-pagination/tf-pagination.vue'),
)

const BATCH = 18

const api = useDependency(UNSPLASH_API_TOKEN)
const notify = useDependency(NOTIFIER_TOKEN)
const lru = useDependency(TOKENS.LRUCache)
const gallery = createGalleryEntity({ gateway: createGalleryGateway(api), lru })

const q = useRouteQuery<string>('q', '', { mode: 'replace' })
const page = useRouteQuery('page', '1', { mode: 'push', transform: Number })
const isDebouncing = ref(false)

watch(q, (newQ, oldQ) => {
  if (newQ !== oldQ && page.value !== 1)
    page.value = 1
}, { flush: 'sync' })

const [debouncedSearch, cancelDebounce] = debounce((query: string, pageNum: number, init?: RequestInit) => {
  return gallery
    .search({ query, page: pageNum, perPage: BATCH }, init)
    .finally(() => {
      isDebouncing.value = false
    })
}, 500)
const controller = shallowRef<AbortController | null>(null)

watch([q, page], (_vals, _old, onCleanup) => {
  const query = q.value.trim()
  if (!query) {
    cancelDebounce()
    isDebouncing.value = false
    return
  }

  controller.value?.abort()
  const c = new AbortController()
  controller.value = c

  isDebouncing.value = true
  debouncedSearch(query, page.value, { signal: c.signal })

  onCleanup(() => {
    c.abort()
    cancelDebounce()
  })
}, { immediate: true })

const entry = computed(() => gallery.getSearchState(q.value, page.value))
const busy = computed(() => entry.value.loading || isDebouncing.value)
const totalPages = computed(() => gallery.getTotalPages(q.value))
const showGrid = computed(() => busy.value || entry.value.items.length > 0)
const hasNoResults = computed(() => !busy.value && entry.value.items.length === 0)
const isSearchEmpty = computed(() => !busy.value && q.value.trim() === '')

watch(() => entry.value.error, (err) => {
  if (err)
    notify.error(err, 'Failed search photos')
})
</script>

<template>
  <SearchPhotosForm v-model="q" data-testid="search-photos-form" mode="inline" />

  <div class="container" :class="classes.galleryContainer">
    <TfMasonryGrid
      v-if="showGrid"
      :items="entry.items"
      :loading="entry.loading || busy"
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
      v-if="entry.items.length"
      :total-pages="totalPages"
      :page="page"
      :disabled="entry.loading"
      data-testid="pagination"
      @change-page="(p) => page = p"
    />

    <div
      v-if="!busy"
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
