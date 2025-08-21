import { parseOrThrow } from '@tf-app/shared/libs'
import { z } from 'zod'

export interface AppConfig {
  unsplashBaseUrl: string
  unsplashClientId: string
  mode?: 'development' | 'production' | 'test'
}

const EnvSchema = z.object({
  VITE_UNSPLASH_API_URL: z.url(),
  VITE_UNSPLASH_CLIENT_ID: z.string().min(1),
  MODE: z.enum(['development', 'production', 'test']).optional(),
})

type EnvDTO = z.infer<typeof EnvSchema>

export function createAppConfigFromEnv(env: ImportMetaEnv): AppConfig {
  const parsedEnv = parseOrThrow<EnvDTO>(EnvSchema, {
    VITE_UNSPLASH_API_URL: env.VITE_UNSPLASH_API_URL,
    VITE_UNSPLASH_CLIENT_ID: env.VITE_UNSPLASH_CLIENT_ID,
    MODE: env.MODE,
  }, 'ENV')
  return {
    unsplashBaseUrl: parsedEnv.VITE_UNSPLASH_API_URL,
    unsplashClientId: parsedEnv.VITE_UNSPLASH_CLIENT_ID,
    mode: parsedEnv.MODE,
  }
}
