import type { ZodType } from 'zod'
import { parseOrThrow } from '@tf-app/shared/libs'
import { HttpError } from './errors'

function parseIntOrUndef(s?: string | null) {
  if (!s)
    return undefined
  const n = Number.parseInt(s, 10)
  return Number.isFinite(n) ? n : undefined
}

async function toHttpError(res: Response): Promise<HttpError> {
  let errors: string[] | undefined
  let bodySnippet: string | undefined

  try {
    const cloned = res.clone()
    const json = await cloned.json()
    if (json && Array.isArray(json.errors) && json.errors.every((x: unknown) => typeof x === 'string')) {
      errors = json.errors
    }
    bodySnippet = JSON.stringify(json).slice(0, 400)
  }
  catch {
    try {
      bodySnippet = (await res.clone().text()).slice(0, 400)
    }
    catch {}
  }

  const limit = parseIntOrUndef(res.headers.get('x-ratelimit-limit'))
  const remaining = parseIntOrUndef(res.headers.get('x-ratelimit-remaining'))
  const retryAfterSec = parseIntOrUndef(res.headers.get('retry-after'))

  return new HttpError({
    status: res.status,
    statusText: res.statusText,
    url: res.url,
    errors,
    bodySnippet,
    rateLimit: { limit, remaining, retryAfterSec },
  })
}

export async function getJson<T>(
  input: RequestInfo,
  init?: RequestInit,
  schema?: ZodType,
  label?: string,
): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok)
    throw await toHttpError(res)
  const data = await res.json()
  return schema ? parseOrThrow<T>(schema, data, label ?? 'Schema mismatch') : (data as T)
}
