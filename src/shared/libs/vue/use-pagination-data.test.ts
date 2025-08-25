import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { usePaginationData } from './use-pagination-data'

function makeArray(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1)
}

describe('usePaginationData', () => {
  it('should use defaults (limit=9, currentPage=1) and compute totalPages', () => {
    const data = ref(makeArray(20))
    const { data: paged, currentPage, totalPages } = usePaginationData<number>(data)

    expect(currentPage.value).toBe(1)
    expect(totalPages.value).toBe(3)
    expect(paged.value).toEqual(makeArray(9))
  })

  it('should slice items according to current page and limit', () => {
    const data = ref(makeArray(20))
    const { data: paged, currentPage, totalPages, changePage }
      = usePaginationData<number>(data, { limit: 5 })

    expect(totalPages.value).toBe(4)

    changePage(2)
    expect(currentPage.value).toBe(2)
    expect(paged.value).toEqual([6, 7, 8, 9, 10])

    changePage(4)
    expect(paged.value).toEqual([16, 17, 18, 19, 20])
  })

  it('should clamp current page to [1, totalPages] when out of range', () => {
    const data = ref(makeArray(12))
    const { currentPage, totalPages, changePage }
      = usePaginationData<number>(data, { limit: 5 })

    changePage(999)
    expect(currentPage.value).toBe(totalPages.value)

    changePage(-5)
    expect(currentPage.value).toBe(1)
  })

  it('should update totalPages when data changes reactively', () => {
    const data = ref(makeArray(10))
    const { totalPages } = usePaginationData<number>(data, { limit: 5 })
    expect(totalPages.value).toBe(2)

    data.value = makeArray(11)
    expect(totalPages.value).toBe(3)
  })

  it('should accept currentPage as a ref and use its initial value', () => {
    const data = ref(makeArray(12))
    const page = ref(2)
    const { currentPage, data: paged }
      = usePaginationData<number>(data, { limit: 5, currentPage: page })

    expect(currentPage.value).toBe(2)
    expect(paged.value).toEqual([6, 7, 8, 9, 10])
  })

  it('should keep at least one page when data is empty (min totalPages = 1)', () => {
    const data = ref<number[]>([])
    const { totalPages, currentPage, data: paged, changePage }
      = usePaginationData<number>(data, { limit: 5 })

    expect(totalPages.value).toBe(1)
    expect(currentPage.value).toBe(1)
    expect(paged.value).toEqual([])

    changePage(3)
    expect(currentPage.value).toBe(1)
  })
})
