import type { MaybeRef } from 'vue'
import { computed, isRef, ref } from 'vue'

interface Options {
  limit?: number
  currentPage?: MaybeRef<number>
}

export function usePaginationData<T>(data: MaybeRef<T[]>, options: Options = {}) {
  const { limit = 9, currentPage: page = 1 } = options

  const currentPage = isRef(page) ? page : ref(page)
  const currentData = isRef(data) ? data : ref(data)
  const totalPages = computed(() => Math.max(1, Math.ceil(currentData.value.length / limit)))
  const slicedData = computed(() => currentData.value.slice((currentPage.value - 1) * limit, (currentPage.value - 1) * limit + limit))

  function changePage(newPage: number) {
    if (newPage > totalPages.value) {
      currentPage.value = totalPages.value
      return
    }

    if (newPage < 1) {
      currentPage.value = 1
      return
    }

    currentPage.value = newPage
  }

  return { data: slicedData, currentPage, totalPages, changePage }
}
