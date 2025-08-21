import type { ZodType } from 'zod'
import { parseOrThrow } from '@tf-app/shared/libs'

export async function getJson<T>(
  input: RequestInfo,
  init?: RequestInit,
  schema?: ZodType,
  label?: string,
): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  return schema ? parseOrThrow<T>(schema, data, label ?? 'Schema mismatch') : (data as T)
}
