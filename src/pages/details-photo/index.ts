import type { RouteRecordRaw } from 'vue-router'

import { routes } from '@tf-app/routing'
import TfHeader from '@tf-app/widgets/tf-header/tf-header.vue'

const DetailPhotoRoute: RouteRecordRaw = {
  path: routes.photoPage.main.path,
  name: routes.photoPage.main.name,
  components: {
    default: () => import('./details-photo-page.vue'),
    TfHeader,
  },
  children: [{
    path: routes.photoPage.fullPhoto.path,
    name: routes.photoPage.fullPhoto.name,
    components: {
      fullPhoto: () => import('@tf-app/features/show-full-photo/show-full-photo.vue'),
    },
  }],
}

export default DetailPhotoRoute
