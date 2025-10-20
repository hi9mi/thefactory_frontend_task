import type { LRUCacheManager } from '@tf-app/shared/libs'

import { token } from 'ditox'

export const TOKENS = {
  LRUCache: token<LRUCacheManager>(),
}
export type Tokens = typeof TOKENS
