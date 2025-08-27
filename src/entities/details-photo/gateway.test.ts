import type { UnsplashPhotoDTO } from '@tf-app/shared/api'
import { describe, expect, it, vi } from 'vitest'
import { createPhotoDetailsGateway, mapDetails } from './gateway'

function makeDto(overrides: Partial<UnsplashPhotoDTO> = {}): UnsplashPhotoDTO {
  return {
    id: 'abc',
    alt_description: 'a photo',
    blur_hash: 'xxx',
    color: '#fff',
    width: 100,
    height: 200,
    urls: {
      raw: 'raw',
      full: 'full',
      small: 'small',
      regular: 'reg',
      thumb: 'th',
      small_s3: null as any,
    },
    links: {
      html: 'html',
      download: 'dl',
      download_location: 'dl_loc',
      self: 'self',
    },
    user: {
      name: 'John',
      username: 'john',
      profile_image: { small: 's', medium: 'm', large: 'l' },
    },
    ...overrides,
  }
}

describe('mapDetails', () => {
  it('should map all fields correctly', () => {
    const dto = makeDto()
    const res = mapDetails(dto)

    expect(res).toMatchObject({
      id: 'abc',
      urlSmall: 'small',
      urlFull: 'full',
      urlRaw: 'raw',
      author: 'John',
      authorUsername: 'john',
      authorAvatar: 'm',
      alt: 'a photo',
      color: '#fff',
      blurHash: 'xxx',
      width: 100,
      height: 200,
      unsplashLink: 'html',
      downloadLink: 'dl',
    })
  })

  it('should set alt to empty string when alt_description is null', () => {
    const dto = makeDto({ alt_description: null })
    const res = mapDetails(dto)
    expect(res.alt).toBe('')
  })
})

describe('createPhotoDetailsGateway', () => {
  it('should call api.getDetailsPhoto and map result', async () => {
    const fakeDto = makeDto()
    const api = { getDetailsPhoto: vi.fn().mockResolvedValue(fakeDto) }

    const gateway = createPhotoDetailsGateway(api as any)
    const result = await gateway.getById('abc')

    expect(api.getDetailsPhoto).toHaveBeenCalledWith('abc', undefined)
    expect(result.id).toBe('abc')
    expect(result.urlSmall).toBe(fakeDto.urls.small)
  })
})
