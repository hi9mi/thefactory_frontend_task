<script lang="ts" setup>
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'

import TfButton from './tf-button.vue'

const state = reactive<{
  disabled: boolean
  content: string
  color: 'white' | 'yellow'
}>({
  disabled: false,
  content: 'Hello world',
  color: 'white',
})
</script>

<template>
  <Story>
    <Variant title="TfButton">
      <TfButton :bg-color="state.color" :disabled="state.disabled" @click="logEvent('My event', $event)">
        {{ state.content }}
      </TfButton>

      <template #controls>
        <HstText v-model="state.content" title="Content" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstRadio
          v-model="state.color"
          title="Background color"
          :options="[
            {
              label: 'White',
              value: 'white',
            },
            {
              label: 'Yellow',
              value: 'yellow',
            },
          ]"
        />
      </template>
    </Variant>
  </Story>
</template>
