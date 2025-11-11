import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpError } from './error'
import { getJson } from './http'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('hTTP layer: getJson / HttpError', () => {
  it('should resolve with parsed JSON on 2xx responses', async () => {
    const payload = { ok: true, items: [1, 2, 3] }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => payload,
    }))

    const data = await getJson('/api/ok')
    expect(data).toEqual(payload)
  })

  it('should throw HttpError with rate limit metadata on 429', async () => {
    const body = { errors: ['Too many requests'] }
    const headers = new Headers({
      'x-ratelimit-limit': '50',
      'x-ratelimit-remaining': '0',
      'retry-after': '2',
      'content-type': 'application/json',
    })

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      headers,
      json: async () => body,
      text: async () => JSON.stringify(body),
    }))

    await expect(getJson('/api/rate-limited')).rejects.toSatisfy((err: any) => {
      expect(err).toBeInstanceOf(Error)
      expect(err).toBeInstanceOf(HttpError)
      expect(err.status).toBe(429)

      if (err.rateLimit) {
        expect(err.rateLimit).toEqual(
          expect.objectContaining({ limit: 50, remaining: 0 }),
        )
      }
      if (typeof err.retryAfter !== 'undefined') {
        expect(err.retryAfter).toBe(2)
      }

      expect(String(err.message).toLowerCase()).toMatch(/too many|rate/i)
      return true
    })
  })

  it('should include textual body in error when JSON is not available', async () => {
    const text = 'Internal Server Error'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers({ 'content-type': 'text/plain' }),
      json: async () => { throw new Error('Invalid JSON') },
      text: async () => text,
    }))

    await expect(getJson('/api/fail')).rejects.toSatisfy((err: any) => {
      expect(err.status).toBe(500)
      expect(String(err.message)).toMatch(/internal server error/i)
      return true
    })
  })

  it('should surface network failures (reject fetch) as errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')))

    await expect(getJson('/api/network')).rejects.toThrow(/network/i)
  })

  it('should propagate AbortError when request is aborted', async () => {
    const abortErr = new Error('Aborted')
    ;(abortErr as any).name = 'AbortError'

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortErr))

    await expect(getJson('/api/aborted')).rejects.toSatisfy((err: any) => {
      expect(err).toBeInstanceOf(Error)
      expect(err.name).toBe('AbortError')
      return true
    })
  })

  it('should fail when JSON parsing fails on 2xx', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => { throw new SyntaxError('Unexpected token') },
    }))

    await expect(getJson('/api/bad-json')).rejects.toThrow(/unexpected token|syntax/i)
  })
})
