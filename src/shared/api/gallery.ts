export async function getRandomPhotos(): Promise<Photo[]> {
  const randomPhotosURL = new URL('photos/random', import.meta.env.VITE_UNSPLASH_API_URL)
  randomPhotosURL.searchParams.set('client_id', import.meta.env.VITE_UNSPLASH_CLIENT_ID)
  randomPhotosURL.searchParams.set('count', '9')

  const res = await fetch(randomPhotosURL)
  if (!res.ok)
    throw new Error('Error fetching photos')

  return res.json()
}

export async function getSearchPhotos(query: string, page: number): Promise<{ results: Photo[]; total: number; total_pages: number }> {
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
