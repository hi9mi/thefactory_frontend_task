export type HttpStatus = number

const HTTP_ERROR_MARKER = Symbol('HttpError')

export interface RateLimitInfo {
  limit?: number
  remaining?: number
  retryAfterSec?: number
}

export class HttpError extends Error {
  readonly status: HttpStatus
  readonly statusText: string
  readonly url?: string
  readonly errors?: string[]
  readonly bodySnippet?: string
  readonly rateLimit?: RateLimitInfo
  protected readonly [HTTP_ERROR_MARKER] = true

  constructor(params: {
    status: HttpStatus
    statusText: string
    url?: string
    errors?: string[]
    bodySnippet?: string
    rateLimit?: RateLimitInfo
    cause?: unknown
  }) {
    const prefix = `${params.status} ${params.statusText}`
    const msg = params.url ? `${prefix} — ${params.url}` : prefix
    super(
      params.errors?.length ? `${msg} | ${params.errors.join(', ')}` : msg,
    )
    this.name = 'HttpError'
    this.status = params.status
    this.statusText = params.statusText
    this.url = params.url
    this.errors = params.errors
    this.bodySnippet = params.bodySnippet
    this.rateLimit = params.rateLimit
    if (params.cause !== undefined)
      (this as any).cause = params.cause
  }
}

export function isHttpError(e: unknown): e is HttpError {
  return typeof e === 'object' && e !== null && HTTP_ERROR_MARKER in e
}

export function isAbortError(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as any).name === 'AbortError'
}
