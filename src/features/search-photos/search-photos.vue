<script setup lang="ts">
import { ref, watch } from 'vue'
import VueInlineSvg from 'vue-inline-svg'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useGalleryStore } from '@tf-app/entities/gallery'
import { routes } from '@tf-app/routing'
import searchIcon from '@tf-app/shared/assets/icons/search.svg'
import { debounce } from '@tf-app/shared/libs'

const router = useRouter()
const route = useRoute()
const galleryStore = useGalleryStore()
const { photos } = storeToRefs(galleryStore)
const searchQuery = ref(route.query.q?.toString() ?? '')

function searchPhotosByQuery(searchQuery: string) {
  galleryStore.getSearchPhotos(searchQuery)
}

const [debouncedSearchPhotosByQuery] = debounce(searchPhotosByQuery)

function onChangeSearch(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  router.push({ replace: true, path: routes.gallery.path, query: { q: target.value } })

  if (target.value.trim().length > 0)
    debouncedSearchPhotosByQuery(target.value)
}

watch(searchQuery, (value) => {
  if (value.trim().length === 0)
    photos.value = null
})
</script>

<template>
  <div class="wrapper">
    <img
      src="/bg.jpg"
      sizes="(max-width: 480px) 384w, 1920w"
      srcset="/bg-mobile.jpg 384px, /bg.jpg 1920px"
      alt=""
      role="presentation"
      class="bg"
    >
    <div class="container search-container">
      <form
        class="form"
        @submit.prevent
      >
        <input
          id="search-photos"
          type="text"
          inputmode="text"
          name="search-photos"
          placeholder="Поиск"
          class="input"
          spellcheck="true"
          :value="searchQuery"
          @input="onChangeSearch"
        >
        <button
          class="icon-button"
          type="submit"
        >
          <VueInlineSvg
            :src="searchIcon"
            fill="none"
            width="23"
            height="23"
            class="icon"
            aria-label="Поиск"
          />
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 250px;
  position: relative;
  border-bottom: 16px solid #C4C4C4;
}

.bg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  filter: brightness(50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.form {
  max-width: 860px;
  width: 100%;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 50px;
  position: relative;
}

.input {
  border: none;
  outline: none;
  padding: 21px 0;
  font-size: 24px;
  font-weight: 300;
  width: 100%;
}

.input::placeholder {
  color: #000;
}

.icon-button {
  position: absolute;
  z-index: 10;
  right: 10px;
  top: 50%;
  transform: translate(-10px, -50%);
  background-color: transparent;
  border: none;
  outline: none;
  color: #000;
  cursor: pointer;
}

@media screen and (width <= 376px) {
  .wrapper {
    height: 230px;
    border: none;
  }
}
</style>
