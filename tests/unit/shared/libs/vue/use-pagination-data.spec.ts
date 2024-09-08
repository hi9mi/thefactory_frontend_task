import { usePaginationData } from '@tf-app/shared/libs/vue/use-pagination-data'
import { describe, expect, it } from 'vitest'

import { ref } from 'vue'

describe('usePaginationData', () => {
  it('should return empty data and totalPages when data is empty', () => {
    const data = ref([])
    const { data: slicedData, totalPages } = usePaginationData(data)

    expect(slicedData.value).toEqual([])
    expect(totalPages.value).toBe(0)
  })

  it('should slice data based on limit and currentPage', () => {
    const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const data = ref(value)
    const { data: slicedData, currentPage } = usePaginationData(data)

    expect(slicedData.value).toEqual(expected)
    expect(currentPage.value).toBe(1)
  })

  it('should respect custom limit option', () => {
    const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const expected = [1, 2, 3]
    const data = ref(value)
    const { data: slicedData } = usePaginationData(data, { limit: 3 })

    expect(slicedData.value).toEqual(expected)
  })

  it('should adjust currentPage and slicedData on changePage', () => {
    const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const expected = [10, 11, 12, 13, 14, 15]
    const data = ref(value)
    const { data: slicedData, currentPage, changePage } = usePaginationData(data)

    changePage(2)

    expect(currentPage.value).toBe(2)
    expect(slicedData.value).toEqual(expected)
  })

  it('should not exceed totalPages on changePage with high value', () => {
    const value = [1, 2, 3, 4, 5]
    const data = ref(value)
    const { currentPage, totalPages, changePage } = usePaginationData(data)

    changePage(10)

    expect(currentPage.value).toBe(totalPages.value)
  })

  it('should not less than 1 on changePage with low value', () => {
    const value = [1, 2, 3, 4, 5]
    const data = ref(value)
    const { currentPage, changePage } = usePaginationData(data)

    changePage(0)
    changePage(-1)
    expect(currentPage.value).toBe(1)
  })

  it('should handle changes in underlying data ref', () => {
    const value = [1, 2, 3]
    const expected = [1, 2, 3, 4, 5]
    const data = ref(value)
    const { data: slicedData } = usePaginationData(data)

    data.value = expected

    expect(slicedData.value).toEqual(expected)
  })
})
