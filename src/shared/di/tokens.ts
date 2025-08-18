import type { Router } from 'vue-router'
import { token } from '@tf-app/shared/di/container'

export interface Notifier {
  success: (msg: string, t?: string) => void
  error: (msg: string, t?: string) => void
  info: (msg: string, t?: string) => void
  warning: (msg: string, t?: string) => void
}

export interface UnsplashAPI {
  getRandomPhotos: () => Promise<any>
  getPhotos: (p: { query: string, page: number }) => Promise<any>
  getDetailsPhoto: (id: string) => Promise<any>
}

export interface AppConfig { baseUrl: string }

export const TOKENS = {
  Router: token<Router>('Router'),
  Notifier: token<Notifier>('Notifier'),
  UnsplashAPI: token<UnsplashAPI>('UnsplashAPI'),
  Config: token<AppConfig>('Config'),
}
