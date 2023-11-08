import type { MaybeRef } from 'vue'
import { ref, toValue, watchEffect } from 'vue'

export function getItemFromLS<T = unknown>(key: string, defaultValue: T): T {
  const dataFromLS = globalThis.localStorage.getItem(key)

  return dataFromLS ? JSON.parse(dataFromLS) : defaultValue
}

export function setItemToLS<T = unknown>(key: string, value: T) {
  globalThis.localStorage.setItem(key, JSON.stringify(value))
}

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
