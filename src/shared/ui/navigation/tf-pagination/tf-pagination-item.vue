<script setup lang="ts">
import VueInlineSvg from 'vue-inline-svg'

import dotsIcon from '@tf-app/shared/assets/icons/dots.svg'
import TfButton from '@tf-app/shared/ui/buttons/tf-button/tf-button.vue'

const props = defineProps<{
  isDots?: boolean
  page: number
  disabled?: boolean
  active?: boolean
}>()
const emit = defineEmits<{
  change: [number]
}>()
function onClick() {
  emit('change', props.page)
}
</script>

<template>
  <div v-if="isDots" :class="classes.dots">
    <VueInlineSvg :src="dotsIcon" width="17" height="17" aria-hidden="true" />
  </div>
  <TfButton
    v-else
    :bg-color="active ? 'yellow' : 'white'"
    :disabled="disabled"
    type="button"
    :class="classes.item"
    @click="onClick"
  >
    <slot />
  </TfButton>
</template>

<style module="classes">
.item {
  height: 32px;
  font-size: 16px;
  padding: 0 10px;
}

.dots {
  height: 32px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
