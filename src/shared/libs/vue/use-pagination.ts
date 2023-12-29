import type { MaybeRef } from 'vue'
import { computed, ref, toRef } from 'vue'

export function usePagination<T>(data: MaybeRef<T[]>, limit = 9) {
  const currentPage = ref(1)
  const totalPages = computed(() => Math.ceil(toRef(data).value.length / limit))
  const slicedData = computed(() => toRef(data).value.slice((currentPage.value - 1) * limit, (currentPage.value - 1) * limit + limit))

  const onNextPage = () => {
    if (currentPage.value < totalPages.value)
      currentPage.value += 1
  }

  const onPreviousPage = () => {
    if (currentPage.value > 0)
      currentPage.value -= 1
  }

  return { data: slicedData, currentPage, totalPages, onNextPage, onPreviousPage }
}
