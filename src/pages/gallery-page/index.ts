import type { RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useGalleryStore } from '@tf-app/entities/gallery'
import { routes } from '@tf-app/routing'
import { TfHeader } from '@tf-app/widgets/tf-header'

const GalleryPageRoute: RouteRecordRaw = {
  path: routes.gallery.path,
  name: routes.gallery.name,
  components: {
    default: () => import('./gallery-page.vue'),
    TfHeader,
  },
  beforeEnter: (from) => {
    const galleryStore = useGalleryStore()
    const { photos } = storeToRefs(galleryStore)
    const searchQuery = from.query.q?.toString().trim()
    const page = Number(from.query.p)

    if (searchQuery && (searchQuery.length > 0))
      galleryStore.getPhotos(searchQuery, page)
    else if (photos.value)
      photos.value = null

    galleryStore.getRandomPhotos()

    return true
  },
}

export default GalleryPageRoute
