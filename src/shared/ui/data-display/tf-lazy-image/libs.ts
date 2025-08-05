import type { ObjectDirective } from 'vue'
import { reactive } from 'vue'

interface LazyImageOptions {
  originalSrc: string
  placeholderSrc: string
  srcset?: string
  sizes?: string
  alt?: string
  intersectionOptions?: IntersectionObserverInit
  onLoad: (element: HTMLImageElement) => void
  onError: (element: HTMLImageElement) => void
  onIntersect: (element: HTMLImageElement) => void
}

export function useLazyImage() {
  const state = reactive({
    isLoading: false,
    isIntersected: false,
    isError: false,
  })

  function load(imgElement: HTMLImageElement, {
    placeholderSrc,
    originalSrc,
    srcset,
    sizes,
    alt,
    onLoad,
    onError,
  }: LazyImageOptions) {
    state.isLoading = true
    imgElement.src = placeholderSrc
    const tempImage = new Image()
    tempImage.src = originalSrc
    if (srcset)
      tempImage.srcset = srcset
    if (sizes)
      tempImage.sizes = sizes

    tempImage.onload = () => {
      imgElement.src = tempImage.src
      imgElement.srcset = tempImage.srcset
      imgElement.sizes = tempImage.sizes
      if (alt)
        imgElement.alt = alt

      state.isLoading = false
      onLoad(imgElement)
    }
    tempImage.onerror = () => {
      state.isLoading = false
      state.isError = true
      onError(imgElement)
    }
  }

  const vLazy: ObjectDirective<HTMLImageElement, LazyImageOptions> = {
    mounted(element, { value }) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          load(element, value)
          observer.disconnect()
          state.isIntersected = true
          value.onIntersect(element)
        }
      }, value.intersectionOptions)

      observer.observe(element)
    },
  }

  return {
    vLazy,
    state,
  }
}
