<script lang="ts" setup>
import { reactive } from 'vue'

import TfSkeleton from './tf-skeleton.vue'

const state = reactive({
  width: 200,
  height: 200,
  type: 'block',
}) satisfies {
  width: number
  height: number
  type: 'block' | 'inline'
}
</script>

<template>
  <Story>
    <Variant title="TfSkeleton">
      <div class="wrapper">
        <TfSkeleton :height="state.height" :width="state.width" :type="state.type" />
        <TfSkeleton :height="state.height" :width="state.width" :type="state.type" />
      </div>

      <template #controls>
        <HstNumber v-model="state.width" title="Width" />
        <HstNumber v-model="state.height" title="Height" />
        <HstInput v-model="state.type" title="Type" />
      </template>
    </Variant>
  </Story>
</template>

<style scoped>
.wrapper {
  padding: 20px;
}

.wrapper > * {
  margin: 10px;
}
</style>
