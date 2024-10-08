import { routes } from '@tf-app/routing'

import TfHeader from '@tf-app/widgets/tf-header/tf-header.vue'
import type { RouteRecordRaw } from 'vue-router'

const GalleryPageRoute: RouteRecordRaw = {
  path: routes.gallery.path,
  name: routes.gallery.name,
  components: {
    default: () => import('./gallery-page.vue'),
    TfHeader,
  },
}

export default GalleryPageRoute
