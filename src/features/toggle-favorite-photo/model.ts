import type { FavoritesRepo } from '@tf-app/entities/favorite-photos'
import type { GalleryItem } from '@tf-app/entities/gallery'
import type { Notifier } from '@tf-app/shared/ui/feedback/tf-notification'

export function createToggleFavorite(deps: { repo: FavoritesRepo, notify: Notifier }) {
  const { repo, notify } = deps
  function toggle(item: GalleryItem) {
    if (repo.has(item.id)) {
      repo.remove(item.id)
      notify.info('Photo removed from favorites', 'Info')
      return false
    }
    else {
      repo.add(item)
      notify.success('Photo added to favorites', 'Success')
      return true
    }
  }
  return { toggle }
}
