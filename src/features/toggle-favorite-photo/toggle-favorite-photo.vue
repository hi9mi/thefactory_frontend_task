<script setup lang="ts">
import type { PhotoListItem } from '@tf-app/entities/photo'
import { FAVORITE_PHOTO_STORE_TOKEN } from '@tf-app/entities/photo'
import { useDependency } from '@tf-app/shared/libs'
import TfButton from '@tf-app/shared/ui/buttons/tf-button/tf-button.vue'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import TfTooltip from '@tf-app/shared/ui/overlays/tf-tooltip/tf-tooltip.vue'
import { computed } from 'vue'
import HeartIcon from '~icons/tf-icons/heart'

const props = defineProps<{
  photo: PhotoListItem
}>()
const favoritesStore = useDependency(FAVORITE_PHOTO_STORE_TOKEN)
const notify = useDependency(NOTIFIER_TOKEN)

async function toggle(photo: PhotoListItem) {
  const result = favoritesStore.toggle(photo)
  if (result === 'added') {
    notify.success('Photo added to favorites', 'Success')
  }
  else if (result === 'removed') {
    notify.info('Photo removed from favorites', 'Info')
  }
}

const isFavoritePhoto = computed(() => favoritesStore.items.some(f => f.id === props.photo.id))
const tooltipLabel = computed(() => isFavoritePhoto.value ? 'Remove from favorites' : 'Add to favorites')
</script>

<template>
  <TfTooltip :label="tooltipLabel" position="top">
    <template #anchor="{ labelledby, onMouseEnter, onMouseLeave, onFocus, onBlur, onKeydown }">
      <TfButton
        data-testid="toggle-favorite-photo-btn"
        :class="classes.btn"
        bg-color="white"
        type="button"
        :aria-labelledby="labelledby"
        @click="toggle(photo)"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
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
