<script setup lang="ts">
import { watch } from 'vue'
import VueInlineSvg from 'vue-inline-svg'

import chevronLeftIcon from '@tf-app/shared/assets/icons/chevron-left.svg'
import chevronRightIcon from '@tf-app/shared/assets/icons/chevron-right.svg'

import { usePagination } from './libs'
import TfPaginationEdge from './tf-pagination-edge.vue'
import TfPaginationItem from './tf-pagination-item.vue'

const props = defineProps<{
  page: number
  totalPages: number
  disabled?: boolean
}>()
const emit = defineEmits<{
  changePage: [number]
}>()
const { activePage, range, hasNextPage, hasPrevPage, next, prev, setPage, DOTS } = usePagination({
  page: props.page,
  total: props.totalPages,
  onChange: page => emit('changePage', page),
})

watch(() => props.page, (newPage) => {
  activePage.value = newPage
})
</script>

<template>
  <div :class="classes.wrapper">
    <TfPaginationEdge
      :disabled="!hasPrevPage || disabled"
      @action="prev"
    >
      <VueInlineSvg :src="chevronLeftIcon" width="17" height="17" aria-hidden="true" />
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
      <VueInlineSvg :src="chevronRightIcon" width="17" height="17" aria-hidden="true" />
    </TfPaginationEdge>
  </div>
</template>

<style module="classes">
.wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
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
