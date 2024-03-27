export interface Photo {
  alt_description: string
  id: string
  links: {
    download: string
    download_location: string
    html: string
    self: string
  }
  urls: {
    full: string
    raw: string
    regular: string
    small: string
    small_s3: string
    thumb: string
  }
  user: {
    name: string
    username: string
    profile_image: {
      large: string
      medium: string
      small: string
    }
  }
  width: number
  height: number
}

export async function getRandomPhotos(): Promise<Photo[]> {
  const randomPhotosURL = new URL('photos/random', import.meta.env.VITE_UNSPLASH_API_URL)
  randomPhotosURL.searchParams.set('client_id', import.meta.env.VITE_UNSPLASH_CLIENT_ID)
  randomPhotosURL.searchParams.set('count', '9')

  const res = await fetch(randomPhotosURL)
  if (!res.ok)
    throw new Error('Error fetching photos')

  return res.json()
}

export interface Photos {
  results: Photo[]
  total: number
  total_pages: number
}

export async function getSearchPhotos(query: string, page: number): Promise<Photos> {
  const photosURL = new URL('search/photos', import.meta.env.VITE_UNSPLASH_API_URL)
  photosURL.searchParams.set('client_id', import.meta.env.VITE_UNSPLASH_CLIENT_ID)
  photosURL.searchParams.set('per_page', '9')
  photosURL.searchParams.set('page', page.toString())
  photosURL.searchParams.set('query', query)

  const res = await fetch(photosURL)
  if (!res.ok)
    throw new Error('Error fetching photos')

  return res.json()
}
