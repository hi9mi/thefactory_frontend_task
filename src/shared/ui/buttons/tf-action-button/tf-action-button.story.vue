<script lang="ts" setup>
import { reactive } from 'vue'
import VueInlineSvg from 'vue-inline-svg'
import { logEvent } from 'histoire/client'

import downloadIcon from '@tf-app/shared/assets/icons/download.svg'

import { TfActionButton } from './index'

const state = reactive({
  disabled: false,
})
</script>

<template>
  <Story>
    <Variant title="TfActionButton">
      <TfActionButton :disabled="state.disabled" @click="logEvent('My event', $event)">
        <VueInlineSvg :src="downloadIcon" width="22" height="22" />
      </TfActionButton>

      <template #controls>
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
