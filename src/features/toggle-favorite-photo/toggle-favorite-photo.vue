<script setup lang="ts">
import type { Photo } from '@tf-app/shared/api'
import { FAVORITES_REPO } from '@tf-app/entities/favorite-photos'

import { TOKENS, useDependency } from '@tf-app/shared/di'
import TfButton from '@tf-app/shared/ui/buttons/tf-button/tf-button.vue'
import TfTooltip from '@tf-app/shared/ui/overlays/tf-tooltip/tf-tooltip.vue'

import { computed } from 'vue'
import HeartIcon from '~icons/tf-icons/heart'
import { createToggleFavorite } from './model'

const props = defineProps<{
  photo: Photo
}>()
const repo = useDependency(FAVORITES_REPO)
const notify = useDependency(TOKENS.Notifier)
const toggleFav = createToggleFavorite({ repo, notify })

const isFavoritePhoto = computed(() => repo.items.value.some(f => f.id === props.photo.id))
const tooltipLabel = computed(() => isFavoritePhoto.value ? 'Remove from favorites' : 'Add to favorites')
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
        @click="toggleFav.toggle(photo)"
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
