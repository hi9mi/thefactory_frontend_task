import type { UnsplashAPI, UnsplashPhotoDTO, UnsplashSearchDTO } from '@tf-app/shared/api'
import type { PhotoDetails, PhotoListItem, SearchPhotosResult } from '../model/types'

export interface PhotoApi {
  getRandomFeed: (count?: number, init?: RequestInit) => Promise<PhotoListItem[]>
  searchPhotos: ({ query, page, perPage }: { query: string, page: number, perPage: number }, init?: RequestInit) => Promise<SearchPhotosResult>
  getDetailsPhoto: (id: string, init?: RequestInit) => Promise<PhotoDetails>
}

export function createPhotoApi(api: UnsplashAPI): PhotoApi {
  return {
    async getRandomFeed(count, init) {
      const raw = await api.getRandomPhotos(count ?? 18, init)
      const arr = Array.isArray(raw) ? raw : []
      return arr.slice(0, count).map(mapPhoto)
    },
    async searchPhotos({ query, page, perPage }, init) {
      const res = await api.getPhotos({ query, page, perPage }, init)
      return mapSearch(res)
    },
    async getDetailsPhoto(id, init) {
      const raw = await api.getDetailsPhoto(id, init)
      return mapDetails(raw)
    },
  }
}

function mapPhoto(dto: UnsplashPhotoDTO) {
  return {
    id: dto.id,
    urlSmall: dto.urls.small,
    urlFull: dto.urls.full,
    urlRaw: dto.urls.raw,
    alt: dto.alt_description ?? '',
    blurHash: dto.blur_hash,
    w: dto.width,
    h: dto.height,
  } satisfies PhotoListItem
}

function mapSearch(dto: UnsplashSearchDTO) {
  return {
    items: dto.results.map(mapPhoto),
    total: dto.total,
    totalPages: dto.total_pages,
  } satisfies SearchPhotosResult
}

function mapDetails(dto: UnsplashPhotoDTO) {
  return {
    id: dto.id,
    urlSmall: dto.urls.small,
    urlFull: dto.urls.full,
    urlRaw: dto.urls.raw,
    author: dto.user.name,
    authorUsername: dto.user.username,
    authorAvatar: dto.user.profile_image.medium,
    alt: dto.alt_description ?? '',
    color: dto.color,
    blurHash: dto.blur_hash,
    w: dto.width,
    h: dto.height,
    unsplashLink: dto.links.html,
    downloadLink: dto.links.download,
  } satisfies PhotoDetails
}
