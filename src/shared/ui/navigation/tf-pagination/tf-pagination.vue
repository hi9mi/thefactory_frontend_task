<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
  disabled?: boolean
}>()
const emit = defineEmits<{
  (e: 'nextPage', page: number): void
  (e: 'prevPage', page: number): void
}>()
const hasPrevPage = computed(() => props.page > 1)
const hasNextPage = computed(() => props.page < props.totalPages)

function prevPage() {
  if (hasPrevPage.value)
    emit('prevPage', props.page - 1)
}
function nextPage() {
  if (hasNextPage.value)
    emit('nextPage', props.page + 1)
}
</script>

<template>
  <div :class="classes.wrapper">
    <button
      :class="classes.btn"
      :disabled="!hasPrevPage || disabled"
      type="button"
      @click="prevPage"
    >
      Предыдущая страница
    </button>
    <button
      :class="classes.btn"
      :disabled="!hasNextPage || disabled"
      type="button"
      @click="nextPage"
    >
      Следующая страница
    </button>
  </div>
</template>

<style module="classes">
.wrapper {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.btn {
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  outline: none;
  color: var(--c-black);
  padding: 13px 11px;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--box-shadow-sm);
}

.btn:disabled {
  background-color: var(--c-weathered-stone);
  cursor: default;
  pointer-events: none;
}
</style>
