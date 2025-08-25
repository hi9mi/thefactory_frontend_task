import { describe, expect, it } from 'vitest'
import { createChildDI, createDI, token } from './container'

describe('dI container (Ditox)', () => {
  it('should resolve registered dependencies', () => {
    const TOK = token<number>('NUMBER')
    const di = createDI()
    di.set(TOK, 42)
    expect(di.get(TOK)).toBe(42)
  })

  it('should create child scope and override parent dependencies', () => {
    const TOK = token<string>('GREETING')
    const root = createDI()
    root.set(TOK, 'hello')

    const child = createChildDI(root)
    child.set(TOK, 'hey')

    expect(root.get(TOK)).toBe('hello')
    expect(child.get(TOK)).toBe('hey')
  })

  it('should throw an understandable error when a provider is missing', () => {
    const TOK = token<boolean>('FLAG')
    const di = createDI()
    expect(() => di.get(TOK)).toThrow(/FLAG/i)
  })

  it('should tokens are unique even with same description', () => {
    const di = createDI()
    const A1 = token<number>('A')
    const A2 = token<number>('A')

    di.set(A1, 1)
    di.set(A2, 2)

    expect(di.get(A1)).toBe(1)
    expect(di.get(A2)).toBe(2)
  })
})
