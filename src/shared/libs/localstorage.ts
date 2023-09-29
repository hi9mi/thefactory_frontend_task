export function getItemFromLS<T = unknown>(key: string, defaultValue: T): T {
  const favoritePhotos = globalThis.localStorage.getItem(key);

  return favoritePhotos ? JSON.parse(favoritePhotos) : defaultValue;
}

export function setItemToLS<T = unknown>(key: string, value: T) {
  globalThis.localStorage.setItem(key, JSON.stringify(value));
}
