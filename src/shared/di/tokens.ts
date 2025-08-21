import type { UnsplashAPI } from '@tf-app/shared/api'
import type { AppConfig } from '@tf-app/shared/libs'
import type { Router } from 'vue-router'
import { token } from '@tf-app/shared/di/container'

export interface Notifier {
  success: (msg: string, t?: string) => void
  error: (msg: string, t?: string) => void
  info: (msg: string, t?: string) => void
  warning: (msg: string, t?: string) => void
}

export const TOKENS = {
  Router: token<Router>('Router'),
  Notifier: token<Notifier>('Notifier'),
  UnsplashAPI: token<UnsplashAPI>('UnsplashAPI'),
  Config: token<AppConfig>('Config'),
}
