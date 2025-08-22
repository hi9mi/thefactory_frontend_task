<script setup lang="ts">
import { createGalleryEntity, createGalleryGateway } from '@tf-app/entities/gallery'
import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { TOKENS, useDependency } from '@tf-app/shared/di'
import { debounce } from '@tf-app/shared/libs'
import TfPhotoCardSkeleton from '@tf-app/widgets/tf-photo-card/tf-photo-card-skeleton.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { useRouteQuery } from '@vueuse/router'
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue'

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)
const TfPagination = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/navigation/tf-pagination/tf-pagination.vue'),
)

const api = useDependency(TOKENS.UnsplashAPI)
const notify = useDependency(TOKENS.Notifier)
const lru = useDependency(TOKENS.LRUCache)
const gallery = createGalleryEntity({ gateway: createGalleryGateway(api), lru })

const q = useRouteQuery<string>('q', '', { mode: 'replace' })
const page = useRouteQuery('page', '1', { mode: 'push', transform: Number })

watch(q, (newQ, oldQ) => {
  if (newQ !== oldQ && page.value !== 1)
    page.value = 1
}, { flush: 'sync' })

const [debouncedSearch, cancelDebounce] = debounce((query: string, pageNum: number, init?: RequestInit) => {
  return gallery.search(query, pageNum, init)
}, 500)
const controller = shallowRef<AbortController | null>(null)

watch([q, page], (_vals, _old, onCleanup) => {
  const query = q.value.trim()
  if (!query) {
    cancelDebounce()
    return
  }

  controller.value?.abort()
  const c = new AbortController()
  controller.value = c

  debouncedSearch(query, page.value, { signal: c.signal })

  onCleanup(() => {
    c.abort()
    cancelDebounce()
  })
}, { immediate: true, flush: 'post' })

const entry = computed(() => gallery.getSearchState(q.value, page.value))
const totalPages = computed(() => gallery.getTotalPages(q.value))
const hasNoResults = computed(() => !entry.value.loading && entry.value.items.length === 0)
const isSearchEmpty = computed(() => hasNoResults.value && q.value === '')

watch(() => entry.value.error, (err) => {
  if (err)
    notify.error(err, 'Failed search photos')
})
</script>

<template>
  <SearchPhotosForm v-model="q" data-testid="search-photos-form" mode="inline" />
  <div class="container" :class="classes.galleryContainer">
    <section
      :class="classes.gallery"
    >
      <template v-if="entry.loading">
        <TfPhotoCardSkeleton v-for="i of 9" :key="i" data-testid="photo-skeleton" />
      </template>
      <template v-else-if="entry.items.length">
        <TfPhotoCard
          v-for="photo of entry.items"
          :key="photo.id"
          data-testid="photo-card"
          :photo="photo"
        />
      </template>
      <p
        v-else-if="isSearchEmpty"
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
    </section>
    <TfPagination
      v-if="entry.items.length"
      :total-pages="totalPages"
      :page="page"
      :disabled="entry.loading"
      data-testid="pagination"
      @change-page="(p) => page = p"
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
