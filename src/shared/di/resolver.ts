import type { Token } from 'ditox'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export type ResolveFn = <T>(t: Token<T>) => T
export const RESOLVER: InjectionKey<ResolveFn> = Symbol('DI_RESOLVER')

export function useResolver(): ResolveFn {
  const r = inject(RESOLVER)
  if (!r)
    throw new Error('DI resolver is not provided')
  return r
}
