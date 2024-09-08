import { routes } from '@tf-app/routing'

import TfHeader from '@tf-app/widgets/tf-header/tf-header.vue'
import type { RouteRecordRaw } from 'vue-router'

const DetailPhotoRoute: RouteRecordRaw = {
  path: routes.photoPage.path,
  name: routes.photoPage.name,
  components: {
    default: () => import('./details-photo-page.vue'),
    TfHeader,
  },
  children: [{
    path: routes.photoPage.children.fullPhoto.path,
    name: routes.photoPage.children.fullPhoto.name,
    components: {
      fullPhoto: () => import('@tf-app/features/show-full-photo/show-full-photo.vue'),
    },
  }],
}

export default DetailPhotoRoute
