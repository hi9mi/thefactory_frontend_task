export type Token<T> = symbol & { __t?: T }
export const token = <T>(desc: string) => Symbol(desc) as Token<T>

export interface DI {
  get: <T>(t: Token<T>) => T
  tryGet: <T>(t: Token<T>) => T | undefined
  set: <T>(t: Token<T>, v: T) => void
  has: <T>(t: Token<T>) => boolean
  parent?: DI | null
  dispose?: () => void
}

function mapFromSeed(seed?: Record<Token<any>, any>) {
  const m = new Map<Token<any>, any>()
  if (seed) {
    for (const k of Reflect.ownKeys(seed)) {
      if (typeof k === 'symbol')
        m.set(k as Token<any>, (seed as any)[k])
    }
  }
  return m
}

export function createDI(seed?: Record<Token<any>, any>, parent?: DI): DI {
  const map = mapFromSeed(seed)
  const di: DI = {
    parent,
    get(t) {
      if (map.has(t))
        return map.get(t)
      if (parent)
        return parent.get(t)
      throw new Error(`DI: token ${String(t)} not found`)
    },
    tryGet(t) {
      if (map.has(t))
        return map.get(t)
      return parent?.tryGet(t)
    },
    set(t, v) { map.set(t, v) },
    has(t) { return map.has(t) || !!parent?.has(t) },
  }
  return di
}

export function createChildDI(parent: DI, seed?: Record<Token<any>, any>) {
  return createDI(seed, parent)
}

export type DependencyModule = (di: DI) => void

export function applyModules(di: DI, ...modules: DependencyModule[]) {
  for (const m of modules) m(di)
}
