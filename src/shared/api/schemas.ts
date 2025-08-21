import { z } from 'zod'

export const UnsplashPhotoSchema = z.object({
  alt_description: z.string().nullable(),
  id: z.string(),
  blur_hash: z.string().nullable(),
  color: z.string().optional(),
  links: z.object({
    download: z.url(),
    download_location: z.url(),
    html: z.url(),
    self: z.url(),
  }),
  urls: z.object({
    full: z.url(),
    raw: z.url(),
    regular: z.url(),
    small: z.url(),
    small_s3: z.url().optional(),
    thumb: z.url(),
  }),
  user: z.object({
    name: z.string(),
    username: z.string(),
    profile_image: z.object({
      large: z.url(),
      medium: z.url(),
      small: z.url(),
    }),
  }),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
})

export const UnsplashSearchSchema = z.object({
  results: z.array(UnsplashPhotoSchema),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
})

export type UnsplashPhotoDTO = z.infer<typeof UnsplashPhotoSchema>
export type UnsplashSearchDTO = z.infer<typeof UnsplashSearchSchema>
