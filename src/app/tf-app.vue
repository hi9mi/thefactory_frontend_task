<script setup lang="ts">
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'
import TfNotifications from '@tf-app/shared/ui/feedback/tf-notification/tf-notifications.vue'
import { pwaInfo } from 'virtual:pwa-info'

import { useRegisterSW } from 'virtual:pwa-register/vue'
import { watch } from 'vue'

// eslint-disable-next-line no-console
console.log(pwaInfo)

const reloadSW: any = '__RELOAD_SW__'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    // eslint-disable-next-line no-console
    console.log(`Service Worker at: ${swUrl}`)
    if (reloadSW === 'true' && r) {
      setInterval(async () => {
        // eslint-disable-next-line no-console
        console.log('Checking for sw update')
        await r.update()
      }, 20000)
    }
    else {
      // eslint-disable-next-line no-console
      console.log(`SW Registered: ${r}`)
    }
  },
})

watch(offlineReady, () => {
  notify({ title: 'App ready to work offline', message: 'App is ready to work offline', type: 'success' })
})
watch(needRefresh, () => {
  notify({ title: 'New content available', message: 'The page will reload after 3 seconds to update', type: 'success' })
  setTimeout(() => {
    updateServiceWorker(true)
  }, 3000)
})
</script>

<template>
  <RouterView name="TfHeader" />
  <RouterView />
  <TfNotifications
    :auto-hide-in-ms="5000"
    :should-not-hide-on-hover="true"
    :has-remove-button="true"
  />
</template>
