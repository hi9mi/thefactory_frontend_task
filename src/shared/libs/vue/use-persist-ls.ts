import type { MaybeRef } from 'vue'
import { ref, toValue, watchEffect } from 'vue'

import { getItemFromLS, setItemToLS } from '../storage/local'

export function usePersistLS<
  T = any,
>(source: MaybeRef<T>, key: string, sync?: boolean) {
  const data = ref(getItemFromLS(key, source))

  if (sync && window) {
    window.addEventListener('storage', (event) => {
      if (event.storageArea !== globalThis.localStorage)
        return

      if (event.newValue)
        data.value = JSON.parse(event.newValue)
    })
  }

  watchEffect(() => {
    setItemToLS(key, toValue(data))
  })

  return data
}
