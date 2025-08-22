<script setup lang="ts">
import { createGalleryEntity, createGalleryGateway, GALLERY_CACHE } from '@tf-app/entities/gallery'

import SearchPhotosForm from '@tf-app/features/search-photos-form/search-photos-form.vue'
import { TOKENS, useDependency } from '@tf-app/shared/di'
import TfPhotoCardSkeleton from '@tf-app/widgets/tf-photo-card/tf-photo-card-skeleton.vue'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card/tf-photo-card.vue'
import { defineAsyncComponent, onMounted, onScopeDispose, shallowRef, watch } from 'vue'

const api = useDependency(TOKENS.UnsplashAPI)
const notify = useDependency(TOKENS.Notifier)
const cache = useDependency(GALLERY_CACHE)
const gallery = createGalleryEntity({ gateway: createGalleryGateway(api), cache })
const { random, randomLoading, randomError } = gallery
const controller = shallowRef<AbortController | null>(null)

const TfAffix = defineAsyncComponent(() =>
  import('@tf-app/shared/ui/overlays/tf-affix/tf-affix.vue'),
)

onMounted(() => {
  controller.value?.abort()
  controller.value = new AbortController()
  gallery.ensureRandom(9, { signal: controller.value.signal })
})

onScopeDispose(() => {
  controller.value?.abort()
})

watch(randomError, (err) => {
  if (err)
    notify.error(err, 'Failed load photos')
})
</script>

<template>
  <SearchPhotosForm data-testid="search-photos-form" mode="navigate" />
  <div class="container" :class="classes.galleryContainer">
    <section
      :class="classes.gallery"
    >
      <template v-if="randomLoading">
        <TfPhotoCardSkeleton v-for="i of 9" :key="i" data-testid="photo-skeleton" />
      </template>
      <template v-else>
        <TfPhotoCard
          v-for="photo of random"
          :key="photo.id"
          :photo="photo"
          data-testid="photo-card"
        />
      </template>
    </section>
    <TfAffix data-testid="affix" />
  </div>
</template>

<style module="classes">
.galleryContainer {
  padding-bottom: 40px;

  container: gallery / inline-size;
}

.gallery {
  --card-min: 320px;
  --gap: 40px;
  --mtop: 100px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-min), 1fr));
  gap: var(--gap);
  margin-top: var(--mtop);
  margin-bottom: 40px;
}

@container gallery (max-width: 1024px) {
  .gallery {
    --gap: 32px;
    --mtop: 80px;
  }
}

@container gallery (max-width: 760px) {
  .gallery {
    --gap: 24px;
    --mtop: 60px;
    --card-min: 300px;
  }
}

@container gallery (max-width: 560px) {
  .gallery {
    --gap: 20px;
    --card-min: 280px;
  }
}
</style>
