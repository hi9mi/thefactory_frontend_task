export { createPhotoApi } from './libs/photo-api'

export {
  createPhotoDetailsStore,
  PHOTO_DETAILS_STORE_TOKEN,
} from './model/details.store'

export {
  createFavoritePhotosStore,
  FAVORITE_PHOTO_STORE_TOKEN,
} from './model/favorites.store'

export {
  createRandomFeedStore,
  RANDOM_FEED_STORE_TOKEN,
} from './model/feed.store'

export {
  createSearchResultStore,
  SEARCH_RESULT_STORE_TOKEN,
} from './model/search.store'

export type { Photo, PhotoDetails, PhotoListItem, SearchPhotosResult } from './model/types'
