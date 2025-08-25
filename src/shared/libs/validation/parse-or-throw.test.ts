import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { parseOrThrow } from './parse-or-throw'

describe('parseOrThrow', () => {
  it('should return parsed data when validation succeeds', () => {
    const Schema = z.object({
      name: z.string().min(1),
      count: z.number().int(),
    })
    const input = { name: 'ok', count: 7 }
    const parsed = parseOrThrow<{ name: string, count: number }>(Schema, input)
    expect(parsed).toEqual({ name: 'ok', count: 7 })
  })

  it('should throw with provided label and include all issue messages', () => {
    const Schema = z.object({
      name: z.string().min(2),
      age: z.number().int().min(0),
    })
    const bad = { name: '', age: -5 }

    expect(() => parseOrThrow(Schema, bad, 'FORM'))
      // eslint-disable-next-line prefer-regex-literals
      .toThrowError(new RegExp(
        String.raw`^FORM\s+→.*name\s+—.*age\s+—`,
        'i',
      ))
  })

  it('should include deep/array paths in the error message', () => {
    const Item = z.object({ id: z.string() })
    const Schema = z.object({ items: z.array(Item) })
    const bad = { items: [{ id: 123 }] }

    expect(() => parseOrThrow(Schema, bad, 'DTO'))
      .toThrow(/DTO\s+→.*items\.0\.id\s+—/i)
  })

  it('should use the default label when none is provided', () => {
    const Schema = z.object({ n: z.number() })
    const bad = { n: 'x' }
    expect(() => parseOrThrow(Schema, bad))
      .toThrow(/^Validation error\s+→/i)
  })

  it('should not mutate the input object and should return only parsed fields', () => {
    const Schema = z.object({ a: z.string() })
    const input = Object.freeze({ a: 'x', extra: 123 } as any)
    const out = parseOrThrow<{ a: string }>(Schema, input)
    expect(out).toEqual({ a: 'x' })
    expect(input).toHaveProperty('extra', 123)
  })
})
