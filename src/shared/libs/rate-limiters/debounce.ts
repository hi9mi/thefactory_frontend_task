export function debounce<F extends (...args: any[]) => any>(
  fn: F,
  ms = 300,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): void {
    if (timeoutId !== null)
      clearTimeout(timeoutId)

    // eslint-disable-next-line
    const self = this
    timeoutId = setTimeout(() => {
      fn.apply(self, args as any)
    }, ms)
  }

  const teardown = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return [debounced, teardown] as const
}
