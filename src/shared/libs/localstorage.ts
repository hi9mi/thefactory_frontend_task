export function getItemFromLS<T = unknown>(key: string, defaultValue: T): T {
  const dataFromLS = globalThis.localStorage.getItem(key)

  return dataFromLS ? JSON.parse(dataFromLS) : defaultValue
}

export function setItemToLS<T = unknown>(key: string, value: T) {
  globalThis.localStorage.setItem(key, JSON.stringify(value))
}
