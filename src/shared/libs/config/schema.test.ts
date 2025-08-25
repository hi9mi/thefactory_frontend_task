import type { AppConfig } from './schema'
import { describe, expect, it } from 'vitest'
import { createAppConfigFromEnv } from './schema'

function makeEnv(overrides: Partial<ImportMetaEnv> = {}): ImportMetaEnv {
  return {
    VITE_UNSPLASH_API_URL: 'https://api.unsplash.com',
    VITE_UNSPLASH_CLIENT_ID: 'test-client-id',
    MODE: 'development',
    ...overrides,
  } as unknown as ImportMetaEnv
}

describe('config schema: createAppConfigFromEnv', () => {
  it('should build AppConfig from valid environment values', () => {
    const env = makeEnv({
      VITE_UNSPLASH_API_URL: 'https://example.com',
      VITE_UNSPLASH_CLIENT_ID: 'abc123',
      MODE: 'production',
    })
    const cfg = createAppConfigFromEnv(env)
    const expected: AppConfig = {
      unsplashBaseUrl: 'https://example.com',
      unsplashClientId: 'abc123',
      mode: 'production',
    }
    expect(cfg).toEqual(expected)
  })

  it('should allow MODE to be omitted (mode remains undefined)', () => {
    const env = makeEnv({ MODE: undefined })
    const cfg = createAppConfigFromEnv(env)
    expect(cfg.mode).toBeUndefined()
  })

  it('should throw when VITE_UNSPLASH_CLIENT_ID is missing or empty', () => {
    const envMissing = makeEnv({ VITE_UNSPLASH_CLIENT_ID: undefined as any })
    expect(() => createAppConfigFromEnv(envMissing)).toThrow()

    const envEmpty = makeEnv({ VITE_UNSPLASH_CLIENT_ID: '' as any })
    expect(() => createAppConfigFromEnv(envEmpty)).toThrow()
  })

  it('should throw when VITE_UNSPLASH_API_URL is not a valid URL', () => {
    const env = makeEnv({ VITE_UNSPLASH_API_URL: 'not-a-url' as any })
    expect(() => createAppConfigFromEnv(env)).toThrow()
  })

  it('should throw when MODE has an unsupported value', () => {
    const env = makeEnv({ MODE: 'staging' as any })
    expect(() => createAppConfigFromEnv(env)).toThrow()
  })
})
