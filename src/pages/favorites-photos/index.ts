import type { RouteRecordRaw } from "vue-router";

import { routes } from "@tf-app/routing";

const FavoritePhotosRoute: RouteRecordRaw = {
  path: routes.favorites.path,
  name: routes.favorites.name,
  component: () => import("./favorite-photos.vue"),
};

export default FavoritePhotosRoute;
