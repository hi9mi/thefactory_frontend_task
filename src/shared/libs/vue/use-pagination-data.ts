import type { MaybeRef } from 'vue'
import { computed, ref, toRef } from 'vue'

interface Options {
  limit?: number
  currentPage?: MaybeRef<number>
}

export function usePaginationData<T>(data: MaybeRef<T[]>, options: Options = {}) {
  const { limit = 9, currentPage: page = 1 } = options

  const currentPage = ref(page)
  const totalPages = computed(() => Math.ceil(toRef(data).value.length / limit))
  const slicedData = computed(() => toRef(data).value.slice((currentPage.value - 1) * limit, (currentPage.value - 1) * limit + limit))

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
