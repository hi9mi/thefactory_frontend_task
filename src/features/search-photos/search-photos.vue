<script setup lang="ts">
import { watch } from 'vue'
import VueInlineSvg from 'vue-inline-svg'
import { useRouteQuery } from '@vueuse/router'

import { useGalleryStore } from '@tf-app/entities/gallery'
import searchIcon from '@tf-app/shared/assets/icons/search.svg'
import { debounce } from '@tf-app/shared/libs'

const emit = defineEmits<{
  change: [value: string]
}>()

const galleryStore = useGalleryStore()
const searchQuery = useRouteQuery<string>('q', '', { mode: 'push' })

function searchPhotosByQuery(searchQuery: string) {
  galleryStore.getPhotos(searchQuery, 1)
}

const [debouncedSearch, teardownDebouncedSearch] = debounce(searchPhotosByQuery, 300)

function onChangeSearch(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  emit('change', target.value)
}

watch(searchQuery, (value) => {
  if (value.trim().length > 0)
    debouncedSearch(value)
  else
    teardownDebouncedSearch()
})
</script>

<template>
  <div :class="classes.wrapper">
    <div class="container" :class="classes.searchContainer">
      <form
        :class="classes.form"
        role="search"
        @submit.prevent
      >
        <input
          id="search-photos"
          type="search"
          inputmode="text"
          name="search-photos"
          placeholder="Поиск"
          :class="classes.input"
          spellcheck="true"
          :value="searchQuery"
          aria-label="Поиск фотографий"
          @input="onChangeSearch"
        >
        <button
          :class="classes.iconButton"
          type="submit"
        >
          <VueInlineSvg
            :src="searchIcon"
            fill="none"
            width="23"
            height="23"
            :class="classes.icon"
            aria-label="Поиск"
          />
        </button>
      </form>
    </div>
  </div>
</template>

<style module="classes">
.wrapper {
  height: 250px;
  border-bottom: 16px solid var(--c-weathered-stone);
  background-image: url('/img/bg-mobile.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  filter: brightness(50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.searchContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 2;
}

.form {
  max-width: 860px;
  width: 100%;
  background-color: var(--c-primary-bg);
  padding-left: 20px;
  padding-right: 50px;
  position: relative;
  border-radius: var(--border-radius-sm);
}

.input {
  border: none;
  outline: none;
  padding: 21px 0;
  font-size: 24px;
  font-weight: 300;
  width: 100%;
  background-color: transparent;
  color: var(--font-color);
}

.input[type="search"]::-webkit-search-decoration,
.input[type="search"]::-webkit-search-cancel-button,
.input[type="search"]::-webkit-search-results-button,
.input[type="search"]::-webkit-search-results-decoration { display: none; }

.input::placeholder {
  color: var(--font-color);
}

.iconButton {
  position: absolute;
  z-index: 10;
  right: 10px;
  top: 50%;
  transform: translate(-10px, -50%);
  background-color: transparent;
  border: none;
  outline: none;
  color: var(--font-color);
  cursor: pointer;
}

.iconButton:focus-visible {
  outline: 3px dashed var(--font-color);
  outline-offset: 4px;
  border-radius: var(--border-radius-sm);
}

@media screen and (width <= 796px) {
  .wrapper {
    height: 230px;
    border: none;
  }
}

:global(html:is(.dark)) .wrapper {
  border-bottom-color: var(--c-light-slate-grey);
}

@media screen and (width >= 796px) {
  .wrapper {
    background-image: url('/img/bg.jpg');
  }
}
</style>
