<script setup lang="ts">
import TfActionButton from '@tf-app/shared/ui/buttons/tf-action-button/tf-action-button.vue'
import TfImage from '@tf-app/shared/ui/data-display/tf-image/tf-image.vue'
import { onMounted, useTemplateRef, watch } from 'vue'
import XMarkIcon from '~icons/tf-icons/x-mark'

const props = defineProps<{
  src: string
  open: boolean
  ariaLabel?: string
  alt: string
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = useTemplateRef('dialogRef')

watch(
  () => props.open,
  (open) => {
    if (open) {
      dialogRef.value?.showModal()
    }
    else {
      dialogRef.value?.close()
    }
  },
)
onMounted(() => {
  if (props.open)
    dialogRef.value?.showModal()
})

function handleDialogClose() {
  emit('close')
  dialogRef.value?.close()
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    handleDialogClose()
  }
}
</script>

<template>
  <!-- eslint-disable -->
  <!-- vue-a11y/no-static-element-interactions, this rule is disabled because it's a dialog -->
  <dialog
    ref="dialogRef"
    aria-modal="true"
    :aria-label="ariaLabel"
    @click="handleBackdropClick"
    @close="handleDialogClose"
    :class="classes.dialog"
  >
    <div :class="classes.wrapper">
      <TfImage
        :src="`${src}&w=640&h=640&dpr=2&q=80`"
        :srcset="`${src}&w=320&h=320&dpr=1&q=80 320w, ${src}&w=640&h=640&dpr=2&q=80 640w, ${src}&w=1024&h=1024&dpr=3&q=80 1024w`"
        sizes="(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px"
        :alt="alt"
        :class="classes.photo"
      />
      <TfActionButton
        :class="classes.closeBtn"
        aria-label="Close preview image"
        data-testid="close-preview-btn"
        @click="handleDialogClose"
      >
        <XMarkIcon
          width="25"
          height="25"
          aria-hidden="true"
        />
      </TfActionButton>
    </div>
  </dialog>
    <!-- eslint-enable -->
</template>

<style module="classes">
.dialog {
  border: none;
  padding: 0;
  margin: 0;

  position: fixed;
  inset: 0;
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;

  background: transparent;
  overflow: hidden;
  display: grid;
  place-items: center;

  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.dialog[open] {
  opacity: 1;
  transform: scale(1);
}

.dialog:not([open]) {
  display: none;
}

.dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);

  opacity: 0;
  transition:
    opacity 0.2s ease,
    overlay 0.2s ease allow-discrete,
    display 0.2s ease allow-discrete;
}

.dialog[open]::backdrop {
  opacity: 1;
}

.wrapper {
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

.photo {
  max-width: calc(100vw - 120px);
  max-height: calc(100vh - 120px);
  object-fit: contain;
  display: block;
}

.closeBtn {
  position: absolute;
  top: -35px;
  right: -35px;
  z-index: 2;
  color: var(--color-white);
}

@media screen and (width <= 678px) {
  .wrapper {
    padding: 20px;
  }
}

@starting-style {
  .dialog[open] {
    opacity: 0;
    transform: scale(0.95);
  }
  .dialog[open]::backdrop {
    opacity: 0;
  }
}
</style>
