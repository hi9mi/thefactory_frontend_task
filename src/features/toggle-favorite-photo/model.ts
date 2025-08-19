import type { FavoritesRepo } from '@tf-app/entities/favorite-photos'
import type { Photo } from '@tf-app/shared/api'
import type { Notifier } from '@tf-app/shared/di/tokens'

export function createToggleFavorite(deps: { repo: FavoritesRepo, notify: Notifier }) {
  const { repo, notify } = deps
  function toggle(item: Photo) {
    if (repo.has(item.id)) {
      repo.remove(item.id)
      notify.info('Photo removed from favorites')
      return false
    }
    else {
      repo.add(item)
      notify.success('Photo added to favorites')
      return true
    }
  }
  return { toggle }
}
