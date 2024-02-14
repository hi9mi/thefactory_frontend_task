import type { RouteRecordRaw } from 'vue-router'

import { useDetailsPhotoStore } from '@tf-app/entities/details-photo'
import { routes } from '@tf-app/routing'
import { TfHeader } from '@tf-app/widgets/tf-header'

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
  beforeEnter: (from) => {
    const detailsPhotoStore = useDetailsPhotoStore()
    detailsPhotoStore.getDetailsPhoto(from.params.id.toString())
    return true
  },
}

export default DetailPhotoRoute
