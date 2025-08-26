import type { UnsplashAPI, UnsplashPhotoDTO, UnsplashSearchDTO } from '@tf-app/shared/api'

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

export function mapPhoto(dto: UnsplashPhotoDTO): GalleryItem {
  return {
    id: dto.id,
    urlSmall: dto.urls.small,
    urlFull: dto.urls.full,
    urlRaw: dto.urls.raw,
    author: dto.user?.name,
    authorUsername: dto.user?.username,
    likes: undefined,
    alt: dto.alt_description ?? '',
    color: dto.color,
    blurHash: dto.blur_hash,
    w: dto.width,
    h: dto.height,
  }
}

export function mapSearch(dto: UnsplashSearchDTO): GallerySearchResult {
  return {
    items: dto.results.map(mapPhoto),
    total: dto.total,
    totalPages: dto.total_pages,
  }
}

export interface GalleryGateway {
  random: (count?: number, init?: RequestInit) => Promise<GalleryItem[]>
  search: ({ query, page, perPage }: { query: string, page: number, perPage: number }, init?: RequestInit) => Promise<GallerySearchResult>
}

export function createGalleryGateway(api: UnsplashAPI): GalleryGateway {
  return {
    async random(count = 18, init) {
      const raw = await api.getRandomPhotos(count, init)
      const arr = Array.isArray(raw) ? raw : []
      return arr.slice(0, count).map(mapPhoto)
    },
    async search({ query, page, perPage }, init) {
      const res = await api.getPhotos({ query, page, perPage }, init)
      return mapSearch(res as any)
    },
  }
}
