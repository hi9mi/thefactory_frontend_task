export interface Photo {
  id: string
  urlSmall: string
  urlFull: string
  urlRaw: string
  author: string
  authorUsername: string
  authorAvatar: string
  alt?: string
  color?: string
  blurHash: string | null
  w: number
  h: number
  unsplashLink: string
  downloadLink: string
}

export type PhotoListItem = Pick<Photo, 'id' | 'urlSmall' | 'urlFull' | 'urlRaw' | 'alt' | 'blurHash' | 'w' | 'h'>
export type PhotoDetails = Photo
export interface SearchPhotosResult {
  items: PhotoListItem[]
  total: number
  totalPages: number
}
