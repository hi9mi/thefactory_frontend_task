<script lang="ts" setup>
import { reactive } from 'vue'

import type { Photo } from '@tf-app/shared/api'
import TfLoader from '@tf-app/shared/ui/feedback/tf-loader/tf-loader.vue'

import TfLazyImage from './tf-lazy-image.vue'

const state = reactive<{
  photo: Photo | null
  loading: boolean
}>({
  photo: null,
  loading: false,
})

async function loadRandomPhoto() {
  state.loading = true
  const randomPhotosURL = new URL('photos/random', 'https://api.unsplash.com')
  randomPhotosURL.searchParams.set('client_id', '_KrzP7Yj9ObontNacjoQht00agosJQygX9l-ctvlLbE')

  const response = await fetch(randomPhotosURL)
  state.photo = await response.json()
  state.loading = false
}

loadRandomPhoto()
</script>

<template>
  <Story>
    <Variant title="TfPagination">
      <TfLoader v-if="state.loading || !state.photo" />
      <TfLazyImage
        v-else
        :original-src="`${state.photo.urls.raw}&w=640&h=640&dpr=2&q=80`"
        :alt="state.photo.alt_description"
        :placeholder-src="state.photo.urls.thumb"
      />
      <template #controls>
        <HstButton @click="loadRandomPhoto">
          Load image
        </HstButton>
      </template>
    </Variant>
  </Story>
</template>
