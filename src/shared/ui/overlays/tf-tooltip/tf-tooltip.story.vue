<script lang="ts" setup>
import TfActionButton from '@tf-app/shared/ui/buttons/tf-action-button/tf-action-button.vue'

import DownloadIcon from '~icons/tf-icons/download'
import { reactive } from 'vue'

import type { Placement } from '@tf-app/shared/libs/dom/compute-coords-from-placement'

import TfTooltip from './tf-tooltip.vue'

const state = reactive<{ label: string, position: Placement }>({
  label: 'Example of TfTooltip',
  position: 'top',
})
const options = [
  'top',
  'bottom',
  'left',
  'right',
  'right-start',
  'right-end',
  'left-start',
  'left-end',
  'top-start',
  'top-end',
  'bottom-start',
  'bottom-end',
]
</script>

<template>
  <Story>
    <Variant title="TfTooltip">
      <TfTooltip :label="state.label" :position="state.position">
        <template #anchor="{ labelledby, onMouseEnter, onMouseLeave }">
          <TfActionButton :aria-labelledby="labelledby" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
            <DownloadIcon width="22" height="22" />
          </TfActionButton>
        </template>
      </TfTooltip>

      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.position"
          title="Select position"
          :options="options"
        />
      </template>
    </Variant>
  </Story>
</template>
