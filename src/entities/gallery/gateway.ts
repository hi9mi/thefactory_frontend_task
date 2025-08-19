import type { Photo, Photos } from '@tf-app/shared/api'
import type { UnsplashAPI } from '@tf-app/shared/di/tokens'
import { token } from 'ditox'

export interface GalleryItem {
  id: string
  urlSmall: string
  urlFull: string
  urlRaw: string
  author?: string
  authorUsername?: string
  likes?: number
  alt?: string
  color?: string
  blurHash: string | null
  w?: number
  h?: number
}

export interface GallerySearchResult {
  items: GalleryItem[]
  total: number
  totalPages: number
}

export function mapPhoto(dto: Photo): GalleryItem {
  return {
    id: dto.id,
    urlSmall: dto.urls.small,
    urlFull: dto.urls.full,
    urlRaw: dto.urls.raw,
    author: dto.user?.name,
    authorUsername: dto.user?.username,
    likes: undefined,
    alt: dto.alt_description,
    color: dto.color,
    blurHash: dto.blur_hash,
    w: dto.width,
    h: dto.height,
  }
}

export function mapSearch(dto: Photos): GallerySearchResult {
  return {
    items: dto.results.map(mapPhoto),
    total: dto.total,
    totalPages: dto.total_pages,
  }
}

export interface GalleryGateway {
  random: (count?: number) => Promise<GalleryItem[]>
  search: (query: string, page: number) => Promise<GallerySearchResult>
}

export const GALLEY_GATEWAY = token<GalleryGateway>('GALLERY_GATEWAY')

export function createGalleryGateway(api: UnsplashAPI): GalleryGateway {
  return {
    async random(count = 9) {
      const raw = await api.getRandomPhotos()
      const arr = Array.isArray(raw) ? raw : []
      return arr.slice(0, count).map(mapPhoto)
    },
    async search(query, page) {
      const res = await api.getPhotos({ query, page })
      return mapSearch(res as any)
    },
  }
}
