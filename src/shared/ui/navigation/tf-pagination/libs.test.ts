import { describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { usePagination } from './libs'

function makePager(overrides?: Partial<{
  page: number
  totalPages: number
  siblings: number
  boundaries: number
}>) {
  const props = reactive({
    page: 1,
    totalPages: 20,
    siblings: 1,
    boundaries: 1,
    ...overrides,
  })
  const onChange = vi.fn((p: number) => {
    props.page = p
  })
  const api = usePagination({ props, onChange })
  return { props, onChange, api }
}

describe('usePagination', () => {
  it('should expose DOTS as -1', () => {
    const { api } = makePager()
    expect(api.DOTS).toBe(-1)
  })

  it('should compute a full range without dots when totalPageNumbers >= total', () => {
    const { api } = makePager({ totalPages: 5, siblings: 1, boundaries: 1 })
    expect(api.range.value).toEqual([1, 2, 3, 4, 5])
  })

  it('should show only right dots when near the start', () => {
    const { api, props } = makePager({ totalPages: 20, page: 2, siblings: 1, boundaries: 1 })
    expect(api.range.value).toEqual([1, 2, 3, 4, 5, api.DOTS, 20])

    api.first()
    expect(props.page).toBe(1)
    expect(api.range.value).toEqual([1, 2, 3, 4, 5, api.DOTS, 20])
  })

  it('should show only left dots when near the end', () => {
    const { api, props } = makePager({ totalPages: 20, page: 19, siblings: 1, boundaries: 1 })
    expect(api.range.value).toEqual([1, api.DOTS, 16, 17, 18, 19, 20])

    api.last()
    expect(props.page).toBe(20)
    expect(api.range.value).toEqual([1, api.DOTS, 16, 17, 18, 19, 20])
  })

  it('should show both left and right dots when in the middle', () => {
    const { api } = makePager({ totalPages: 20, page: 10, siblings: 1, boundaries: 1 })
    expect(api.range.value).toEqual([1, api.DOTS, 9, 10, 11, api.DOTS, 20])
  })

  it('should report hasPrevPage/hasNextPage accordingly', () => {
    const { api, props } = makePager({ totalPages: 3, page: 1 })
    expect(api.hasPrevPage.value).toBe(false)
    expect(api.hasNextPage.value).toBe(true)

    api.next()
    expect(props.page).toBe(2)
    expect(api.hasPrevPage.value).toBe(true)
    expect(api.hasNextPage.value).toBe(true)

    api.last()
    expect(props.page).toBe(3)
    expect(api.hasNextPage.value).toBe(false)
  })

  it('should clamp setPage below 1 to 1 and call onChange once', () => {
    const { api, props, onChange } = makePager({ totalPages: 5, page: 3 })
    onChange.mockClear()
    api.setPage(0)
    expect(props.page).toBe(1)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('should clamp setPage above total to total and call onChange once', () => {
    const { api, props, onChange } = makePager({ totalPages: 5, page: 3 })
    onChange.mockClear()
    api.setPage(999)
    expect(props.page).toBe(5)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('should clamp next/prev at ends', () => {
    const { api, props, onChange } = makePager({ totalPages: 2, page: 1 })
    onChange.mockClear()

    api.prev()
    expect(props.page).toBe(1)

    api.next()
    expect(props.page).toBe(2)

    api.next()
    expect(props.page).toBe(2)
  })
})
