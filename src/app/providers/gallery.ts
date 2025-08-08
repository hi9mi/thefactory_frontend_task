import { createGalleryModel } from '@tf-app/entities/gallery'
import { di } from '@tf-app/shared/di/container'
import { TOKENS } from '@tf-app/shared/di/tokens'

export function provideGalleryModel() {
  const api = di.resolve(TOKENS.UnsplashAPI)
  const notify = di.resolve(TOKENS.Notifier)
  return createGalleryModel({ api, notify })
}
