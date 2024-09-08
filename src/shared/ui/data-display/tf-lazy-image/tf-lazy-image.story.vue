<script lang="ts" setup>
import { logEvent } from 'histoire/client'
import { reactive } from 'vue'

import TfLazyImage from './tf-lazy-image.vue'

const state = reactive({
  key: 'initial',
})
function rerenderImage() {
  state.key = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}
</script>

<template>
  <Story>
    <Variant title="TfLazyImage">
      <TfLazyImage
        :key="state.key"
        :original-src="`https://images.unsplash.com/photo-1713350472357-704e65809226?ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTU5Mjk2MjV8&ixlib=rb-4.0.3&w=640&h=640&dpr=2&q=80&crop=entropy&random=${state.key}`"
        alt="a very long tunnel with some lights in it"
        placeholder-src="https://images.unsplash.com/photo-1713350472357-704e65809226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTU5Mjk2MjV8&ixlib=rb-4.0.3&q=80&w=200"
        @loaded="logEvent('loaded', $event)"
        @intersected="logEvent('intersected', $event)"
        @error="logEvent('error', $event)"
      />

      <template #controls>
        <HstButton
          color="primary"
          class="htw-p-2"
          @click="rerenderImage"
        >
          Rerender image
        </HstButton>
      </template>
    </Variant>
  </Story>
</template>
