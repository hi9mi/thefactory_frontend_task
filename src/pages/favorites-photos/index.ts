import { routes } from '@tf-app/routing'

import TfHeader from '@tf-app/widgets/tf-header/tf-header.vue'
import type { RouteRecordRaw } from 'vue-router'

const FavoritePhotosRoute: RouteRecordRaw = {
  path: routes.favorites.path,
  name: routes.favorites.name,
  components: {
    default: () => import('./favorite-photos-page.vue'),
    TfHeader,
  },
}

export default FavoritePhotosRoute
