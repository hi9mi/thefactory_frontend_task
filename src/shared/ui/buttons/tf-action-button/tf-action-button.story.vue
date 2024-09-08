<script lang="ts" setup>
import DownloadIcon from '~icons/tf-icons/download'
import { logEvent } from 'histoire/client'

import { reactive } from 'vue'

import TfActionButton from './tf-action-button.vue'

const state = reactive({
  disabled: false,
})
</script>

<template>
  <Story>
    <Variant title="TfActionButton">
      <TfActionButton :disabled="state.disabled" @click="logEvent('My event', $event)">
        <DownloadIcon width="22" height="22" />
      </TfActionButton>

      <template #controls>
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
