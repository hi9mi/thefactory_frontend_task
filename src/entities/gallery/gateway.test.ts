import type { UnsplashAPI, UnsplashPhotoDTO, UnsplashSearchDTO } from '@tf-app/shared/api'
import { describe, expect, it, vi } from 'vitest'
import { createGalleryGateway, mapPhoto, mapSearch } from './gateway'

function makePhotoDto(overrides: Partial<UnsplashPhotoDTO> = {}): UnsplashPhotoDTO {
  return {
    id: 'ph_1',
    alt_description: 'a photo',
    blur_hash: 'hash',
    color: '#abcdef',
    width: 1000,
    height: 800,
    urls: {
      raw: 'raw-url',
      full: 'full-url',
      regular: 'regular-url',
      small: 'small-url',
      thumb: 'thumb-url',
      small_s3: null as any,
    },
    links: {
      html: 'html-link',
      download: 'download-link',
      download_location: 'download-loc',
      self: 'self-link',
    },
    user: {
      name: 'Alice',
      username: 'alice',
      profile_image: { small: 'ps', medium: 'pm', large: 'pl' },
    },
    ...overrides,
  }
}

function makeSearchDto(overrides: Partial<UnsplashSearchDTO> = {}): UnsplashSearchDTO {
  return {
    total: 42,
    total_pages: 5,
    results: [makePhotoDto({ id: 'ph_a' }), makePhotoDto({ id: 'ph_b' })],
    ...overrides,
  } as UnsplashSearchDTO
}

describe('mapPhoto', () => {
  it('should map fields correctly from DTO', () => {
    const dto = makePhotoDto()
    const res = mapPhoto(dto)
    expect(res).toMatchObject({
      id: 'ph_1',
      urlSmall: 'small-url',
      urlFull: 'full-url',
      urlRaw: 'raw-url',
      author: 'Alice',
      authorUsername: 'alice',
      alt: 'a photo',
      color: '#abcdef',
      blurHash: 'hash',
      w: 1000,
      h: 800,
    })
    expect(res.likes).toBeUndefined()
  })

  it('should set alt to empty string when alt_description is null', () => {
    const dto = makePhotoDto({ alt_description: null })
    const res = mapPhoto(dto)
    expect(res.alt).toBe('')
  })

  it('should keep author fields undefined when user is missing', () => {
    const dto = makePhotoDto({ user: undefined as any })
    const res = mapPhoto(dto)
    expect(res.author).toBeUndefined()
    expect(res.authorUsername).toBeUndefined()
  })
})

describe('mapSearch', () => {
  it('should map search result with items and totals', () => {
    const dto = makeSearchDto()
    const res = mapSearch(dto)
    expect(res.total).toBe(42)
    expect(res.totalPages).toBe(5)
    expect(res.items).toHaveLength(2)
    expect(res.items[0].id).toBe('ph_a')
  })
})

describe('createGalleryGateway', () => {
  it('should call api.getRandomPhotos and map/slice result', async () => {
    const api = {
      getRandomPhotos: vi.fn().mockResolvedValue([
        makePhotoDto({ id: 'r1' }),
        makePhotoDto({ id: 'r2' }),
        makePhotoDto({ id: 'r3' }),
      ]),
      getPhotos: vi.fn(),
    } as unknown as UnsplashAPI

    const gw = createGalleryGateway(api)
    const res = await gw.random(2)

    expect((api as any).getRandomPhotos).toHaveBeenCalledWith(2, undefined)
    expect(res.map(x => x.id)).toEqual(['r1', 'r2'])
    expect(res[0]).toMatchObject({ urlSmall: 'small-url' })
  })

  it('should return empty array when api.getRandomPhotos returns non-array', async () => {
    const api = {
      getRandomPhotos: vi.fn().mockResolvedValue(makePhotoDto({ id: 'single' })),
      getPhotos: vi.fn(),
    } as unknown as UnsplashAPI

    const gw = createGalleryGateway(api)
    const res = await gw.random(3)
    expect(res).toEqual([])
  })

  it('should pass init through to getRandomPhotos', async () => {
    const api = {
      getRandomPhotos: vi.fn().mockResolvedValue([]),
      getPhotos: vi.fn(),
    } as unknown as UnsplashAPI

    const gw = createGalleryGateway(api)
    const init: RequestInit = { headers: { 'X-Test': '1' } }
    await gw.random(4, init)
    expect((api as any).getRandomPhotos).toHaveBeenCalledWith(4, init)
  })

  it('should call api.getPhotos with args and map via mapSearch', async () => {
    const searchDto = makeSearchDto({ total: 7, total_pages: 3, results: [makePhotoDto({ id: 's1' })] })
    const api = {
      getRandomPhotos: vi.fn(),
      getPhotos: vi.fn().mockResolvedValue(searchDto),
    } as unknown as UnsplashAPI

    const gw = createGalleryGateway(api)
    const res = await gw.search({ query: 'cats', page: 2, perPage: 9 })

    expect((api as any).getPhotos).toHaveBeenCalledWith({ query: 'cats', page: 2, perPage: 9 }, undefined)
    expect(res.total).toBe(7)
    expect(res.totalPages).toBe(3)
    expect(res.items).toHaveLength(1)
    expect(res.items[0].id).toBe('s1')
  })

  it('should pass init through to getPhotos', async () => {
    const api = {
      getRandomPhotos: vi.fn(),
      getPhotos: vi.fn().mockResolvedValue(makeSearchDto()),
    } as unknown as UnsplashAPI

    const gw = createGalleryGateway(api)
    const init: RequestInit = { headers: { 'X-Test': '1' } }
    await gw.search({ query: 'q', page: 1, perPage: 10 }, init)
    expect((api as any).getPhotos).toHaveBeenCalledWith({ query: 'q', page: 1, perPage: 10 }, init)
  })
})
