<script setup lang="ts">
import VueInlineSvg from 'vue-inline-svg'

import icon from '@tf-app/shared/assets/icons/download.svg'
import { notify, TfButton } from '@tf-app/shared/ui'

const props = defineProps<{
  src: string
  name?: string
  withText?: boolean
}>()

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

    document.body.removeChild(anchorElement)
    globalThis.URL.revokeObjectURL(href)
  }
  catch (error) {
    notify({
      title: 'Не удалось начать загрузку фотографии',
      message: 'Что-то пошло не так, попробуйте еще раз',
      type: 'error',
    })
  }
}
</script>

<template>
  <TfButton
    bg-color="yellow"
    type="button"
    :class="classes.btn"
    @click="downloadPhoto"
  >
    <VueInlineSvg
      :src="icon"
      width="23"
      height="21"
      aria-label="Скачать фото"
    />
    <span v-if="withText" :class="classes.text">Скачать</span>
  </TfButton>
</template>

<style module="classes">
.btn {
  color: var(--c-squid-ink)
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
