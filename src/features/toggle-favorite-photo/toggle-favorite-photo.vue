<script setup lang="ts">
import { useFavoritePhotosStore } from '@tf-app/entities/favorite-photos'
import TfButton from '@tf-app/shared/ui/buttons/tf-button/tf-button.vue'

import TfTooltip from '@tf-app/shared/ui/overlays/tf-tooltip/tf-tooltip.vue'
import HeartIcon from '~icons/tf-icons/heart'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import type { Photo } from '@tf-app/shared/api'

const props = defineProps<{
  photo: Photo
}>()
const favoritePhotosStore = useFavoritePhotosStore()
const { favoritePhotos } = storeToRefs(favoritePhotosStore)

const isFavoritePhoto = computed(() => favoritePhotos.value.some(f => f.id === props.photo.id))
const tooltipLabel = computed(() => isFavoritePhoto.value ? 'Удалить из избранного' : 'Добавить в избранное')
</script>

<template>
  <TfTooltip :label="tooltipLabel" position="top">
    <template #anchor="{ labelledby, onMouseEnter, onMouseLeave }">
      <TfButton
        data-testid="toggle-favorite-photo-btn"
        :class="classes.btn"
        bg-color="white"
        type="button"
        :aria-labelledby="labelledby"
        @click="favoritePhotosStore.toggleFavoritePhoto(photo)"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <HeartIcon
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
  </TfTooltip>
</template>

<style module="classes">
.btn {
  background-color: var(--color-snow);
}

.icon {
  color: var(--color-black);
}

.favorite {
  fill: var(--color-candy-apple);
  color: var(--color-candy-apple);
}
</style>
