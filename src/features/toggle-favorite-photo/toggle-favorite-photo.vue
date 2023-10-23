<script setup lang="ts">
import { computed } from 'vue'
import VueInlineSvg from 'vue-inline-svg'
import { storeToRefs } from 'pinia'

import { useFavoritePhotosStore } from '@tf-app/entities/favorite-photos'
import heartIcon from '@tf-app/shared/assets/icons/heart.svg'

const props = defineProps<{
  photo: Photo
}>()
const favoritePhotosStore = useFavoritePhotosStore()
const { favoritePhotos } = storeToRefs(favoritePhotosStore)

const isFavoritePhoto = computed(() => favoritePhotos.value.some(f => f.id === props.photo.id))
</script>

<template>
  <button
    class="btn"
    @click="favoritePhotosStore.toggleFavoritePhoto(photo)"
  >
    <VueInlineSvg
      :src="heartIcon"
      fill="none"
      width="23"
      height="21"
      aria-label="Избранное"
      class="icon"
      :class="{
        ['favorite']: isFavoritePhoto,
      }"
    />
  </button>
</template>

<style scoped>
.btn {
  background-color: #fff;
  border: none;
  border-radius: 8px;
  outline: none;
  color: #000;
  padding: 13px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 0 4px 0 rgb(0 0 0 / 25%);
}

.icon {
  color: #000;
}

.favorite {
  fill: #FF0800;
  color: #FF0800;
}
</style>
