import type { RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useGalleryStore } from '@tf-app/entities/gallery'
import { routes } from '@tf-app/routing'
import TfHeader from '@tf-app/widgets/tf-header.vue'

const GalleryPageRoute: RouteRecordRaw = {
  path: routes.gallery.path,
  name: routes.gallery.name,
  components: {
    default: () => import('./gallery-page.vue'),
    TfHeader,
  },
  beforeEnter: (from) => {
    const galleryStore = useGalleryStore()
    const { searchQuery } = storeToRefs(galleryStore)
    searchQuery.value = from.query.q?.toString() ?? ''

    galleryStore.getRandomPhotos()

    return true
  },
}

export default GalleryPageRoute
