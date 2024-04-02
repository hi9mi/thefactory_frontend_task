import { type ObjectDirective, ref } from 'vue'

interface LazyImageOptions {
  originalSrc: string
  placeholderSrc: string
  srcset?: string
  sizes?: string
  alt?: string
}

export function useLazyImage() {
  const loading = ref(false)

  function load(imgElement: HTMLImageElement, { placeholderSrc, originalSrc, srcset, sizes, alt }: LazyImageOptions) {
    loading.value = true
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

      loading.value = false
    }
  }

  const vLazy: ObjectDirective<HTMLImageElement, LazyImageOptions> = {
    mounted(element, { value }) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            load(element, value)
            observer.disconnect()
          }
        })
      }, {
        rootMargin: '100px 0px 100px 0px',
      })

      observer.observe(element)
    },
  }

  return {
    vLazy,
    loading,
  }
}
