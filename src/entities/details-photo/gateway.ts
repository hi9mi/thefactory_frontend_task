import type { UnsplashAPI, UnsplashPhotoDTO } from '@tf-app/shared/api'

export interface DetailsPhoto {
  id: string
  urlSmall: string
  urlFull: string
  urlRaw: string
  author: string
  authorUsername: string
  authorAvatar: string
  alt: string | null
  color?: string
  blurHash: string | null
  width: number
  height: number
  unsplashLink: string
  downloadLink: string
}

export function mapDetails(dto: UnsplashPhotoDTO): DetailsPhoto {
  return {
    id: dto.id,
    urlSmall: dto.urls.small,
    urlFull: dto.urls.full,
    urlRaw: dto.urls.raw,
    author: dto.user.name,
    authorUsername: dto.user.username,
    authorAvatar: dto.user.profile_image.medium,
    alt: dto.alt_description,
    color: dto.color,
    blurHash: dto.blur_hash,
    width: dto.width,
    height: dto.height,
    unsplashLink: dto.links.html,
    downloadLink: dto.links.download,
  }
}

export interface PhotoDetailsGateway {
  getById: (id: string, init?: RequestInit) => Promise<DetailsPhoto>
}

export function createPhotoDetailsGateway(api: UnsplashAPI): PhotoDetailsGateway {
  return {
    async getById(id, init) {
      const raw = await api.getDetailsPhoto(id, init)
      return mapDetails(raw)
    },
  }
}
