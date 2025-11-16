import type { Options } from 'quick-lru'
import { token } from 'ditox'
import QuickLRU from 'quick-lru'

export function createLRUCache<K, V>(options: Options<K, V>) {
  return new QuickLRU<K, V>(options)
}

export const CACHE_TOKEN = token<QuickLRU<string, unknown>>('CACHE_TOKEN')
