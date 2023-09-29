import type { RouteRecordRaw } from "vue-router";

import { useDetailsPhotoStore } from "@tf-app/entities/details-photo";
import { routes } from "@tf-app/routing";

const DetailPhotoRoute: RouteRecordRaw = {
  path: routes.photoPage.path,
  name: routes.photoPage.name,
  component: () => import("./details-photo.vue"),
  beforeEnter: (from) => {
    const detailsPhotoStore = useDetailsPhotoStore();
    detailsPhotoStore.getDetailsPhoto(from.params.id as string);
    return true;
  },
};

export default DetailPhotoRoute;
