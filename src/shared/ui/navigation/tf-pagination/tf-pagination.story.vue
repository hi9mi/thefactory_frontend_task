<script lang="ts" setup>
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'

import TfPagination from './tf-pagination.vue'

const state = reactive({
  page: 1,
  totalPages: 10,
})

function handleNextPage(page: number) {
  logEvent('nextPage Event', { page })
  state.page = page
}
function handlePrevPage(page: number) {
  logEvent('prevPage Event', { page })
  state.page = page
}
</script>

<template>
  <Story>
    <Variant title="TfPagination">
      <TfPagination
        :total-pages="state.totalPages"
        :page="state.page"
        @next-page="handleNextPage"
        @prev-page="handlePrevPage"
      />

      <template #controls>
        <HstNumber v-model="state.page" title="Page" />
        <HstNumber v-model="state.totalPages" title="Total Pages" />
      </template>
    </Variant>
  </Story>
</template>
