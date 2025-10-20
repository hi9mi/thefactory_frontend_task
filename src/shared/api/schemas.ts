import * as z from 'zod/mini'

export const UnsplashPhotoSchema = z.object({
  alt_description: z.nullable(z.string()),
  id: z.string(),
  blur_hash: z.nullable(z.string()),
  color: z.optional(z.string()),
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
    small_s3: z.optional(z.url()),
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
  width: z.number().check(z.int(), z.positive()),
  height: z.number().check(z.int(), z.positive()),
})

export const UnsplashSearchSchema = z.object({
  results: z.array(UnsplashPhotoSchema),
  total: z.number().check(z.nonnegative()),
  total_pages: z.number().check(z.nonnegative()),
})

export type UnsplashPhotoDTO = z.infer<typeof UnsplashPhotoSchema>
export type UnsplashSearchDTO = z.infer<typeof UnsplashSearchSchema>
