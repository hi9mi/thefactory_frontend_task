<script setup lang="ts">
import TfActionButton from '@tf-app/shared/ui/buttons/tf-action-button/tf-action-button.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import XMarkIcon from '~icons/tf-icons/x-mark'

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  src: string
  description: string
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement>()
const router = useRouter()
const route = useRoute('/photo/[id]')

const scrollTop = window.scrollY

onMounted(() => {
  dialogRef.value?.showModal()

  document.documentElement.style.top = `-${scrollTop}px`
  document.documentElement.classList.add('lock-scrollbar')
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('lock-scrollbar')
  document.documentElement.style.top = ''

  globalThis.requestAnimationFrame(() => {
    window.scrollTo({ top: scrollTop, left: 0, behavior: 'instant' })
  })
})
function handleDialogClose() {
  closeFullPhoto()
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    closeFullPhoto()
  }
}

function closeFullPhoto() {
  emit('close')
  const { full, ...rest } = route.query
  router.push({ query: rest })
}
</script>

<template>
  <!-- eslint-disable -->
  <!-- vue-a11y/no-static-element-interactions, this rule is disabled because it's a dialog -->
  <dialog
    ref="dialogRef"
    v-bind="$attrs"
    aria-modal="true"
    :class="classes.dialog"
    :aria-label="description || 'Fullscrean viewing photo'"
    @click="handleBackdropClick"
    @close="handleDialogClose"
  >
    <div :class="classes.wrapper">
      <img
        :src="`${src}&w=640&h=640&dpr=2&q=80`"
        :srcset="`${src}&w=320&h=320&dpr=1&q=80 320w, ${src}&w=640&h=640&dpr=2&q=80 640w, ${src}&w=1024&h=1024&dpr=3&q=80 1024w`"
        sizes="(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px"
        :alt="description || 'Фотография в полном размере'"
        :class="classes.photo"
      >

      <TfActionButton
        :class="classes.closeBtn"
        aria-label="Закрыть полноэкранный режим"
        data-testid="close-preview-btn"
        @click="closeFullPhoto"
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
    transform 0.2s easy,
    overlay 0.2s ease allow-discrete,
    display 0.2s ease allow-discrete;
}

.dialog[open] {
  opacity: 1;
  transform: scale(1);
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
  /*padding: 60px;*/
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
