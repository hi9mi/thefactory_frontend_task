<script lang="ts" setup>
import { logEvent } from 'histoire/client'

import { notify, TfNotifications } from './index'

const notificationsContainer = document.createElement('div')
notificationsContainer.id = 'notifications'
document.body.append(notificationsContainer)
</script>

<template>
  <Story>
    <Variant title="TfNotifications">
      <div>
        <button @click="notify({ title: 'Success', message: 'success notification', type: 'success' })">
          Success notification
        </button>
        <button @click="notify({ title: 'Fail', message: 'fail notification', type: 'error' })">
          Fail notification
        </button>
      </div>

      <TfNotifications
        :auto-hide-in-ms="5000"
        :has-remove-button="true"
        :should-not-hide-on-hover="true"
        @click="logEvent('Click event', $event)"
        @remove="logEvent('Remove event', $event)"
      />
    </Variant>
  </Story>
</template>
