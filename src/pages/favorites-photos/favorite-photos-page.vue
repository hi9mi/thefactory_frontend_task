<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'

import { useFavoritePhotosStore } from '@tf-app/entities/favorite-photos'
import TfPhotoCard from '@tf-app/widgets/tf-photo-card.vue'

const TfAffix = defineAsyncComponent(() => import('@tf-app/shared/ui/tf-affix.vue'))

const favoritePhotosStore = useFavoritePhotosStore()
const { favoritePhotos } = storeToRefs(favoritePhotosStore)
</script>

<template>
  <main class="container">
    <h1 class="title">
      Избранное
    </h1>
    <div
      v-if="favoritePhotos.length > 0"
      class="gallery"
    >
      <TfPhotoCard
        v-for="favPhoto of favoritePhotos"
        :key="favPhoto.id"
        :photo="favPhoto"
      />
    </div>
    <p
      v-else
      class="favorites-empty"
    >
      В избранном пусто...
    </p>
    <TfAffix />
  </main>
</template>

<style scoped>
.title {
  font-size: 72px;
  font-weight: 700;
  text-align: center;
  margin: 100px 0;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 20px;
  margin: 100px 0;
}

.favorites-empty{
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
}

@media screen and (width <= 760px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }

  .title {
    font-size: 56px;
    margin: 70px 0;
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
}
</style>
