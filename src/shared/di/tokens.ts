import type { Photo, Photos } from '@tf-app/shared/api'
import type { Router } from 'vue-router'
import { token } from 'ditox'

export interface Notifier {
  success: (msg: string, title?: string) => void
  error: (msg: string, title?: string) => void
}

export interface UnsplashAPI {
  getRandomPhotos: () => Promise<Photo[]>
  getPhotos: (params: { query: string, page: number }) => Promise<Photos>
  getDetailsPhoto: (id: string) => Promise<Photo>
}

export const TOKENS = {
  Router: token<Router>('Router'),
  Notifier: token<Notifier>('Notifier'),
  UnsplashAPI: token<UnsplashAPI>('UnsplashAPI'),
}
