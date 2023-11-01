import type { RouteRecordRaw } from 'vue-router'

import { useDetailsPhotoStore } from '@tf-app/entities/details-photo'
import { routes } from '@tf-app/routing'
import { TfHeader } from '@tf-app/widgets/tf-header'

const DetailPhotoRoute: RouteRecordRaw = {
  path: routes.photoPage.path,
  name: routes.photoPage.name,
  components: {
    default: () => import('./details-photo-page.vue'),
    TfHeader,
  },
  beforeEnter: (from) => {
    const detailsPhotoStore = useDetailsPhotoStore()
    detailsPhotoStore.getDetailsPhoto(from.params.id.toString())
    return true
  },
}

export default DetailPhotoRoute
