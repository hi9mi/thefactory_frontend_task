<script lang="ts" setup>
import { logEvent } from 'histoire/client'
import { reactive } from 'vue'

import TfPagination from './tf-pagination.vue'

const state = reactive({
  page: 1,
  totalPages: 10,
})

function changePage(page: number) {
  logEvent('changePage', { page })
  state.page = page
}
</script>

<template>
  <Story>
    <Variant title="TfPagination">
      <TfPagination
        :total-pages="state.totalPages"
        :page="state.page"
        @change-page="changePage"
      />

      <template #controls>
        <HstNumber v-model="state.page" title="Page" />
        <HstNumber v-model="state.totalPages" title="Total Pages" />
      </template>
    </Variant>
  </Story>
</template>
