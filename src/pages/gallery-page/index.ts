import { storeToRefs } from "pinia";
import type { RouteRecordRaw } from "vue-router";

import { useGalleryStore } from "@tf-app/entities/gallery";
import { routes } from "@tf-app/routing";

const GalleryPageRoute: RouteRecordRaw = {
  path: routes.gallery.path,
  name: routes.gallery.name,
  component: () => import("./gallery-page.vue"),
  beforeEnter: (from) => {
    const galleryStore = useGalleryStore();
    const { searchQuery } = storeToRefs(galleryStore);
    searchQuery.value = from.query.q?.toString() ?? "";

    galleryStore.getRandomPhotos();

    return true;
  },
};

export default GalleryPageRoute;
