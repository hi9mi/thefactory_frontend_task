import type { HttpError } from '@tf-app/shared/api'

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Invalid access token',
  403: 'Forbidden (check permissions/rate limit)',
  404: 'Not Found',
  500: 'Server error, try later',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
}

export function normalizeHttpError(error: HttpError) {
  if (error.rateLimit?.remaining === 0) {
    return 'Rate limit exceeded'
  }
  return error.errors?.join(', ') ?? ERROR_MESSAGES[error.status] ?? (error.status >= 500 ? 'Server error, try later' : 'Unknown HTTP error')
}
