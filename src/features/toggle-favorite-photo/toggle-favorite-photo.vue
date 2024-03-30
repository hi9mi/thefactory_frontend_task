<script setup lang="ts">
import { computed } from 'vue'
import VueInlineSvg from 'vue-inline-svg'
import { storeToRefs } from 'pinia'

import { useFavoritePhotosStore } from '@tf-app/entities/favorite-photos'
import type { Photo } from '@tf-app/shared/api'
import heartIcon from '@tf-app/shared/assets/icons/heart.svg'
import { TfButton } from '@tf-app/shared/ui'

const props = defineProps<{
  photo: Photo
}>()
const favoritePhotosStore = useFavoritePhotosStore()
const { favoritePhotos } = storeToRefs(favoritePhotosStore)

const isFavoritePhoto = computed(() => favoritePhotos.value.some(f => f.id === props.photo.id))
</script>

<template>
  <TfButton
    :class="classes.btn"
    bg-color="white"
    type="button"
    @click="favoritePhotosStore.toggleFavoritePhoto(photo)"
  >
    <VueInlineSvg
      :src="heartIcon"
      fill="none"
      width="23"
      height="21"
      aria-label="Избранное"
      :class="{
        [classes.favorite]: isFavoritePhoto,
        [classes.icon]: true,
      }"
    />
  </TfButton>
</template>

<style module="classes">
.btn {
  background-color: var(--c-snow);
}

.icon {
  color: var(--c-black);
}

.favorite {
  fill: var(--c-candy-apple);
  color: var(--c-candy-apple);
}
</style>
