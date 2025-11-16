import type { AppConfig } from '@tf-app/shared/config'
import type { UnsplashPhotoDTO, UnsplashSearchDTO } from './schemas'
import { token } from 'ditox'
import * as z from 'zod/mini'
import { getJson } from './http'
import {
  UnsplashPhotoSchema,
  UnsplashSearchSchema,
} from './schemas'

export interface UnsplashAPI {
  getRandomPhotos: (count: number, init?: RequestInit) => Promise<UnsplashPhotoDTO[]>
  getPhotos: (params: { query: string, page: number, perPage: number }, init?: RequestInit) => Promise<UnsplashSearchDTO>
  getDetailsPhoto: (id: string, init?: RequestInit) => Promise<UnsplashPhotoDTO>
}
// TODO: refactor
function mergeHeaders(a?: HeadersInit, b?: HeadersInit): Headers {
  const h = new Headers(a ?? {})
  const add = (src?: HeadersInit) => {
    if (!src)
      return
    new Headers(src).forEach((v, k) => h.set(k, v))
  }
  add(b)
  return h
}

function withInit(base: RequestInit, override?: RequestInit): RequestInit {
  if (!override)
    return base
  const { headers: baseHeaders, ...restBase } = base
  const { headers: overHeaders, ...restOver } = override
  return {
    ...restBase,
    ...restOver,
    headers: mergeHeaders(baseHeaders, overHeaders),
  }
}

export function createUnsplashApi(cfg: AppConfig): UnsplashAPI {
  const BASE = cfg.unsplashBaseUrl
  const baseInit: RequestInit = {
    headers: { Authorization: `Client-ID ${cfg.unsplashClientId}` },
  }

  return {
    getRandomPhotos: (count, init) =>
      getJson(
        `${BASE}/photos/random?count=${count}`,
        withInit(baseInit, init),
        z.array(UnsplashPhotoSchema),
        'Unsplash.random',
      ),

    getPhotos: ({ query, page, perPage }, init) =>
      getJson(
        `${BASE}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
        withInit(baseInit, init),
        UnsplashSearchSchema,
        'Unsplash.search',
      ),

    getDetailsPhoto: (id, init) =>
      getJson(
        `${BASE}/photos/${encodeURIComponent(id)}`,
        withInit(baseInit, init),
        UnsplashPhotoSchema,
        'Unsplash.details',
      ),
  }
}

export const UNSPLASH_API_TOKEN = token<UnsplashAPI>('UnsplashAPI')
