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
  const randomPhotosURL = new URL('photos/random', import.meta.env.VITE_UNSPLASH_API_URL)
  randomPhotosURL.searchParams.set('client_id', import.meta.env.VITE_UNSPLASH_CLIENT_ID)

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
