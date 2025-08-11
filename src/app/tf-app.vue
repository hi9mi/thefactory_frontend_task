<script setup lang="ts">
import { TOKENS, useResolver } from '@tf-app/shared/di'
import TfNotifications from '@tf-app/shared/ui/feedback/tf-notification/ui/tf-notifications.vue'
import { pwaInfo } from 'virtual:pwa-info'

import { useRegisterSW } from 'virtual:pwa-register/vue'
import { watch } from 'vue'

// eslint-disable-next-line no-console
console.log(pwaInfo)

const reloadSW: any = '__RELOAD_SW__'

const resolve = useResolver()
const notifier = resolve(TOKENS.Notifier)

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
  notifier.info('App ready to work offline', 'App is ready to work offline')
})
watch(needRefresh, () => {
  notifier.info('New content available', 'The page will reload after 3 seconds to update')
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
