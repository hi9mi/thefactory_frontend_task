export function debounce<A = unknown, R = void>(fn: (...args: A[]) => R, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;

  function debouncedFn(this: unknown, ...args: A[]) {
    clearTimeout(timeoutId);

    return new Promise<R>((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(fn.apply(this, args));
      }, ms);
    });
  }

  const teardown = () => clearTimeout(timeoutId);

  return [debouncedFn, teardown] as const;
}
