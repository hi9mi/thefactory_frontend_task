import type { ZodType } from 'zod'

export function parseOrThrow<T>(
  schema: ZodType,
  data: unknown,
  label = 'Validation error',
): T {
  const r = schema.safeParse(data)
  if (!r.success) {
    const msg = r.error.issues
      .map(i => `${i.path.join('.')} — ${i.message}`)
      .join('; ')
    throw new Error(`${label} → ${msg}`)
  }
  return r.data as T
}
