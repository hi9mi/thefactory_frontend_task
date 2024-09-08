import { routes } from '@tf-app/routing'

import TfHeader from '@tf-app/widgets/tf-header/tf-header.vue'
import type { RouteRecordRaw } from 'vue-router'

const SearchPageRoute: RouteRecordRaw = {
  path: routes.search.path,
  name: routes.search.name,
  components: {
    default: () => import('./search-page.vue'),
    TfHeader,
  },
}

export default SearchPageRoute
