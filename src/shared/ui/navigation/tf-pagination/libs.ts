import { computed } from 'vue'

interface PaginationOptions {
  props: {
    page: number
    totalPages: number
    siblings: number
    boundaries: number
  }
  onChange: (page: number) => void
}

export function usePagination({
  props,
  onChange,
}: PaginationOptions) {
  const DOTS = -1
  const _total = computed(() => Math.max(Math.trunc(props.totalPages), 0))

  const activePage = computed({
    get() {
      return props.page
    },
    set(newPage) {
      onChange(newPage)
    },
  })
  const hasPrevPage = computed(() => activePage.value > 1)
  const hasNextPage = computed(() => activePage.value < _total.value)

  function setPage(newPage: number) {
    if (!hasPrevPage.value)
      activePage.value = 1

    if (!hasNextPage.value)
      activePage.value = _total.value

    activePage.value = newPage
  }

  const next = () => setPage(activePage.value + 1)
  const prev = () => setPage(activePage.value - 1)
  const first = () => setPage(1)
  const last = () => setPage(_total.value)

  const paginationRange = computed(() => {
    const totalPageNumbers = props.siblings * 2 + 3 + props.boundaries * 2
    if (totalPageNumbers >= _total.value)
      return range(1, _total.value)

    const leftSiblingIndex = Math.max(activePage.value - props.siblings, props.boundaries)
    const rightSiblingIndex = Math.min(activePage.value + props.siblings, _total.value - props.boundaries)

    const shouldShowLeftDots = leftSiblingIndex > props.boundaries + 2
    const shouldShowRightDots = rightSiblingIndex < _total.value - (props.boundaries + 1)

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = props.siblings * 2 + props.boundaries + 2
      return range(1, leftItemCount).concat([DOTS], range(_total.value - (props.boundaries - 1), _total.value))
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = props.boundaries + 1 + 2 * props.siblings
      return range(1, props.boundaries).concat([DOTS], range(_total.value - rightItemCount, _total.value))
    }

    return range(1, props.boundaries).concat([DOTS], range(leftSiblingIndex, rightSiblingIndex), [DOTS], range(_total.value - props.boundaries + 1, _total.value))
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
