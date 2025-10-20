import { parseOrThrow } from '@tf-app/shared/libs'
import { token } from 'ditox'
import * as z from 'zod/mini'

export interface AppConfig {
  unsplashBaseUrl: string
  unsplashClientId: string
  mode?: 'development' | 'production' | 'test'
  dev: boolean
  prod: boolean
  ssr: boolean
  viteBaseUrl: string
  baseUrl: string
  storageKind: 'localStorage' | 'sessionStorage' | 'memoryStorage'
}

const EnvSchema = z.object({
  VITE_UNSPLASH_API_URL: z.url(),
  VITE_UNSPLASH_CLIENT_ID: z.string().check(z.minLength(1)),
  MODE: z.optional(z.enum(['development', 'production', 'test'])),
  VITE_BASE_URL: z.string(),
  DEV: z.boolean(),
  PROD: z.boolean(),
  SSR: z.boolean(),
  BASE_URL: z.string(),
  VITE_STORAGE_KIND: z.enum(['localStorage', 'sessionStorage', 'memoryStorage']),
})

type EnvDTO = z.infer<typeof EnvSchema>

export function createAppConfigFromEnv(env: ImportMetaEnv): AppConfig {
  const parsedEnv = parseOrThrow<EnvDTO>(EnvSchema, {
    VITE_UNSPLASH_API_URL: env.VITE_UNSPLASH_API_URL,
    VITE_UNSPLASH_CLIENT_ID: env.VITE_UNSPLASH_CLIENT_ID,
    MODE: env.MODE,
    DEV: env.DEV,
    PROD: env.PROD,
    SSR: env.SSR,
    VITE_BASE_URL: env.VITE_BASE_URL,
    BASE_URL: env.BASE_URL,
    VITE_STORAGE_KIND: env.VITE_STORAGE_KIND,
  }, 'ENV')
  return {
    unsplashBaseUrl: parsedEnv.VITE_UNSPLASH_API_URL,
    unsplashClientId: parsedEnv.VITE_UNSPLASH_CLIENT_ID,
    mode: parsedEnv.MODE,
    dev: parsedEnv.DEV,
    prod: parsedEnv.PROD,
    ssr: parsedEnv.SSR,
    viteBaseUrl: parsedEnv.VITE_BASE_URL,
    baseUrl: parsedEnv.BASE_URL,
    storageKind: parsedEnv.VITE_STORAGE_KIND,
  }
}

export const APP_CONFIG_TOKEN = token<AppConfig>()
