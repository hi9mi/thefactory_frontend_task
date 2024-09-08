<script setup lang="ts">
import ChevronLeftIcon from '~icons/tf-icons/chevron-left'
import ChevronRightIcon from '~icons/tf-icons/chevron-right'
import { usePagination } from './libs'

import TfPaginationEdge from './tf-pagination-edge.vue'
import TfPaginationItem from './tf-pagination-item.vue'

const props = withDefaults(defineProps<{
  page: number
  totalPages: number
  disabled?: boolean
  siblings?: number
  boundaries?: number
}>(), {
  siblings: 1,
  boundaries: 1,
})
const emit = defineEmits<{
  changePage: [number]
}>()

const { activePage, range, hasNextPage, hasPrevPage, next, prev, setPage, DOTS } = usePagination({
  props,
  onChange: page => emit('changePage', page),
})
</script>

<template>
  <div :class="classes.wrapper">
    <TfPaginationEdge
      :disabled="!hasPrevPage || disabled"
      @action="prev"
    >
      <ChevronLeftIcon width="17" height="17" aria-hidden="true" />
    </TfPaginationEdge>

    <TfPaginationItem
      v-for="(pageItem, index) in range"
      :key="index"
      :is-dots="pageItem === DOTS"
      :page="pageItem"
      :disabled="disabled"
      :active="activePage === pageItem"
      @change="setPage"
    >
      {{ pageItem }}
    </TfPaginationItem>

    <TfPaginationEdge
      :disabled="!hasNextPage || disabled"
      @action="next"
    >
      <ChevronRightIcon width="17" height="17" aria-hidden="true" />
    </TfPaginationEdge>
  </div>
</template>

<style module="classes">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius-medium);
  outline: none;
  color: var(--color-black);
  padding: 13px 11px;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--shadow-small);
}

.btn:disabled {
  background-color: var(--color-weathered-stone);
  cursor: default;
  pointer-events: none;
}
</style>
