<script setup lang="ts">
import TfButton from '@tf-app/shared/ui/buttons/tf-button/tf-button.vue'

defineProps<{
  disabled?: boolean
}>()
defineEmits<{
  action: [void]
}>()
</script>

<template>
  <TfButton
    bg-color="white"
    :disabled="disabled"
    type="button"
    :class="classes.edge"
    @click="$emit('action')"
  >
    <slot />
  </TfButton>
</template>

<style module="classes">
.edge {
  height: 32px;
  padding: 0 10px;
  justify-content: center;
}
</style>
