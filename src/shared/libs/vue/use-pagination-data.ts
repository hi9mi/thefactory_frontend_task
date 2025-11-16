import type { MaybeRef, MaybeRefOrGetter } from 'vue'
import { computed, isRef, ref, unref } from 'vue'

interface Options {
  limit?: number
  currentPage?: MaybeRef<number>
}

export function usePaginationData<T>(data: MaybeRefOrGetter<T[]>, options: Options = {}) {
  const { limit = 9, currentPage: page = 1 } = options

  const currentPage = isRef(page) ? page : ref(page)

  const currentData = computed(() => {
    if (typeof data === 'function') {
      return data()
    }
    return unref(data)
  })

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(currentData.value.length / limit))
  })
  const slicedData = computed(() => {
    const start = (currentPage.value - 1) * limit
    return currentData.value.slice(start, start + limit)
  })

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
