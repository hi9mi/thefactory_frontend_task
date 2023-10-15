export async function getDetailsPhoto(id: string): Promise<Photo> {
  const photoURL = new URL(`photos/${id}`, import.meta.env.VITE_UNSPLASH_API_URL)
  photoURL.searchParams.set('client_id', import.meta.env.VITE_UNSPLASH_CLIENT_ID)

  const res = await fetch(photoURL)
  return res.json()
}
