import { computed, ref, watch } from 'vue'

interface PaginationOptions {
  page: number
  total: number
  siblings?: number
  boundaries?: number
  onChange?: (page: number) => void
}

export function usePagination({
  page,
  total,
  siblings = 1,
  boundaries = 1,
  onChange,
}: PaginationOptions) {
  const DOTS = -1
  const _total = Math.max(Math.trunc(total), 0)

  const activePage = ref(page)
  const hasPrevPage = computed(() => activePage.value > 1)
  const hasNextPage = computed(() => activePage.value < _total)

  function setPage(newPage: number) {
    if (!hasPrevPage.value)
      activePage.value = 1

    if (!hasNextPage.value)
      activePage.value = _total

    activePage.value = newPage
  }

  const next = () => setPage(activePage.value + 1)
  const prev = () => setPage(activePage.value - 1)
  const first = () => setPage(1)
  const last = () => setPage(_total)

  const paginationRange = computed(() => {
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2
    if (totalPageNumbers >= _total)
      return range(1, _total)

    const leftSiblingIndex = Math.max(activePage.value - siblings, boundaries)
    const rightSiblingIndex = Math.min(activePage.value + siblings, _total - boundaries)

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
    const shouldShowRightDots = rightSiblingIndex < _total - (boundaries + 1)

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2
      return range(1, leftItemCount).concat([DOTS], range(_total - (boundaries - 1), _total))
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + 2 * siblings
      return range(1, boundaries).concat([DOTS], range(_total - rightItemCount, _total))
    }

    return range(1, boundaries).concat([DOTS], range(leftSiblingIndex, rightSiblingIndex), [DOTS], range(_total - boundaries + 1, _total))
  })

  watch(activePage, (_page) => {
    if (onChange)
      onChange(_page)
  })

  return {
    activePage,
    range: paginationRange,
    hasPrevPage,
    hasNextPage,
    setPage,
    next,
    prev,
    first,
    last,
    DOTS,
  }
}

function range(start: number, end: number) {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}
