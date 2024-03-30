import type { Photo } from './gallery'

export async function getDetailsPhoto(id: string): Promise<Photo> {
  const photoURL = new URL(`photos/${id}`, import.meta.env.VITE_UNSPLASH_API_URL)
  photoURL.searchParams.set('client_id', import.meta.env.VITE_UNSPLASH_CLIENT_ID)

  const res = await fetch(photoURL)
  if (!res.ok)
    throw new Error('Error fetching photo')

  return res.json()
}
