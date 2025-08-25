import { describe, expect, it } from 'vitest'
import { UnsplashPhotoSchema, UnsplashSearchSchema } from './schemas'

function makeValidPhoto(overrides: Partial<Record<string, any>> = {}) {
  return {
    id: 'abc123',
    alt_description: 'A nice photo',
    blur_hash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
    color: '#aabbcc',
    width: 4000,
    height: 3000,
    links: {
      download: 'https://unsplash.com/photos/abc123/download',
      download_location: 'https://api.unsplash.com/photos/abc123/download',
      html: 'https://unsplash.com/photos/abc123',
      self: 'https://api.unsplash.com/photos/abc123',
    },
    urls: {
      full: 'https://images.unsplash.com/photo-full',
      raw: 'https://images.unsplash.com/photo-raw',
      regular: 'https://images.unsplash.com/photo-regular',
      small: 'https://images.unsplash.com/photo-small',
      thumb: 'https://images.unsplash.com/photo-thumb',
      small_s3: 'https://s3.amazonaws.com/photo-small',
    },
    user: {
      name: 'John Doe',
      username: 'john',
      profile_image: {
        large: 'https://images.unsplash.com/profile-large',
        medium: 'https://images.unsplash.com/profile-medium',
        small: 'https://images.unsplash.com/profile-small',
      },
    },
    ...overrides,
  }
}

describe('unsplash Zod schemas', () => {
  it('should parse a fully valid photo payload', () => {
    const payload = makeValidPhoto()
    const parsed = UnsplashPhotoSchema.parse(payload)
    expect(parsed.id).toBe('abc123')
    expect(parsed.urls.small).toMatch(/^https?:\/\//)
    expect(parsed.user.username).toBe('john')
  })

  it('should allow nullable and optional fields (alt_description, blur_hash, color, small_s3)', () => {
    const payload = makeValidPhoto({
      alt_description: null,
      blur_hash: null,
      color: undefined,
      urls: {
        full: 'https://images.unsplash.com/photo-full',
        raw: 'https://images.unsplash.com/photo-raw',
        regular: 'https://images.unsplash.com/photo-regular',
        small: 'https://images.unsplash.com/photo-small',
        thumb: 'https://images.unsplash.com/photo-thumb',
        // small_s3 omitted on purpose
      },
    })
    const res = UnsplashPhotoSchema.safeParse(payload)
    expect(res.success).toBe(true)
  })

  it('should reject when required URL fields are missing or not valid URLs', () => {
    const payload = makeValidPhoto({
      links: {
        // missing download_location, invalid html
        download: 'https://unsplash.com/photos/abc123/download',
        html: 'not-a-url',
        self: 'https://api.unsplash.com/photos/abc123',
      },
    } as any)

    const res = UnsplashPhotoSchema.safeParse(payload)
    expect(res.success).toBe(false)
    if (!res.success) {
      const fields = res.error.issues.map(i => i.path.join('.'))
      expect(fields).toContain('links.download_location')
      expect(fields).toContain('links.html')
    }
  })

  it('should reject when dimensions are non-integer or non-positive', () => {
    const invalidWidth = UnsplashPhotoSchema.safeParse(makeValidPhoto({ width: -1 }))
    expect(invalidWidth.success).toBe(false)

    const invalidHeight = UnsplashPhotoSchema.safeParse(makeValidPhoto({ height: 0 }))
    expect(invalidHeight.success).toBe(false)

    const invalidTypes = UnsplashPhotoSchema.safeParse(makeValidPhoto({ width: '4000' as any }))
    expect(invalidTypes.success).toBe(false)
  })

  it('should reject when optional small_s3 is present but not a valid URL', () => {
    const res = UnsplashPhotoSchema.safeParse(
      makeValidPhoto({ urls: { ...makeValidPhoto().urls, small_s3: 'bad' } }),
    )
    expect(res.success).toBe(false)
  })

  it('should parse a valid search response containing an array of valid photos', () => {
    const photo = makeValidPhoto({ id: 'p1' })
    const payload = {
      total: 123,
      total_pages: 13,
      results: [photo],
    }
    const parsed = UnsplashSearchSchema.parse(payload)
    expect(parsed.total).toBe(123)
    expect(parsed.results.length).toBe(1)
    expect(parsed.results[0].id).toBe('p1')
  })

  it('should reject a search response when results contain invalid photo items', () => {
    const brokenPhoto = { id: 'broken' } // missing required fields
    const payload = {
      total: 1,
      total_pages: 1,
      results: [brokenPhoto],
    }
    const res = UnsplashSearchSchema.safeParse(payload)
    expect(res.success).toBe(false)
  })
})
