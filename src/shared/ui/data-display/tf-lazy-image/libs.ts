import { type ObjectDirective, ref } from 'vue'

export function useLazyImage() {
  const loading = ref(false)
  let observer: IntersectionObserver

  function loadImage(imgElement: HTMLImageElement) {
    imgElement.src = imgElement.dataset.placeholderSrc!

    const img = new Image()
    img.src = imgElement.dataset.originalSrc!
    img.srcset = imgElement.dataset.srcset!
    img.sizes = imgElement.dataset.sizes!

    img.decode().then(() => {
      imgElement.srcset = imgElement.dataset.srcset!
      imgElement.sizes = imgElement.dataset.sizes!
      imgElement.src = imgElement.dataset.originalSrc!
      loading.value = false
    })
  }

  const vLazy: ObjectDirective<HTMLImageElement, void> = {
    mounted(el) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry && entry.isIntersecting) {
            loading.value = true
            loadImage(el)
            observer.disconnect()
          }
        })
      }, {
        rootMargin: '50px 0px 0px 0px',
      })

      observer.observe(el)
    },
    beforeUnmount(el) {
      observer.unobserve(el)
    },
  }

  return {
    vLazy,
    loading,
  }
}
