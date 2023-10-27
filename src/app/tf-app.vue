<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const TfPrompt = defineAsyncComponent(() => import('@tf-app/shared/ui/tf-prompt.vue'))
const TfNotifications = defineAsyncComponent(() => import('@tf-app/shared/ui/feedback/tf-notification/tf-notifications.vue'))
</script>

<template>
  <RouterView name="TfHeader" />
  <RouterView />
  <TfPrompt />
  <TfNotifications
    :auto-hide-in-ms="3000"
    :should-not-hide-on-hover="true"
    :has-remove-button="true"
  />
</template>
