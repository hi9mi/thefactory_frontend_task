<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
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
  <div class="wrapper">
    <button class="btn" :disabled="!hasPrevPage" type="button" @click="prevPage">
      Предыдущая страница
    </button>
    <button class="btn" :disabled="!hasNextPage" type="button" @click="nextPage">
      Следующая страница
    </button>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.btn {
  background-color: transparent;
  border: none;
  border-radius: 8px;
  outline: none;
  color: #000;
  padding: 13px 11px;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 0 4px 0 rgb(0 0 0 / 25%);
}

.btn:disabled {
  background-color: #C4C4C4;
  cursor: default;
}
</style>
