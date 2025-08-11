<script setup lang="ts">
import { TOKENS, useResolver } from '@tf-app/shared/di'
import TfButton from '@tf-app/shared/ui/buttons/tf-button/tf-button.vue'

import DownloadIcon from '~icons/tf-icons/download'

const props = defineProps<{
  src: string
  name?: string
  withText?: boolean
}>()

const resolve = useResolver()
const notifier = resolve(TOKENS.Notifier)

async function downloadPhoto() {
  try {
    const response = await fetch(props.src)

    const blobImage = await response.blob()

    const href = globalThis.URL.createObjectURL(blobImage)

    const anchorElement = document.createElement('a')
    anchorElement.href = href
    anchorElement.download = (props.name ? props.name : 'photo')

    document.body.appendChild(anchorElement)
    anchorElement.click()

    anchorElement.remove()
    globalThis.URL.revokeObjectURL(href)
  }
  catch (error) {
    console.error('Download photo error', error)
    notifier.warning('Error while downloading photo', 'Error')
  }
}
</script>

<template>
  <TfButton
    bg-color="yellow"
    type="button"
    :class="classes.btn"
    data-testid="download-photo-btn"
    @click="downloadPhoto"
  >
    <DownloadIcon
      width="23"
      height="21"
      aria-label="Скачать фото"
    />
    <span v-if="withText" :class="classes.text">Скачать</span>
  </TfButton>
</template>

<style module="classes">
.btn {
  color: var(--color-squid-ink);
}

.text {
  font-size: 20px;
  line-height: 0;
}

@media screen and (width <= 560px) {
  .text {
    display: none;
  }
}
</style>
