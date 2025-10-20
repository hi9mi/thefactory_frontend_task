import type { ZodMiniType } from 'zod/mini'

export function parseOrThrow<T>(
  schema: ZodMiniType,
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
