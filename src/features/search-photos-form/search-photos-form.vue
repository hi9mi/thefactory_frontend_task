<script setup lang="ts">
import SearchIcon from '~icons/tf-icons/search'
import { ref, watch } from 'vue'

import { useRoute } from 'vue-router'

const emit = defineEmits<{
  submit: [string]
}>()
const route = useRoute()
const searchTerm = ref(route.query.q as string ?? '')

function onSubmit() {
  emit('submit', searchTerm.value)
}

watch(() => route.query.q, (newValue) => {
  searchTerm.value = newValue as string
})
</script>

<template>
  <div :class="classes.wrapper">
    <div class="container" :class="classes.searchContainer">
      <form
        :class="classes.form"
        role="search"
        @submit.prevent="onSubmit"
      >
        <input
          id="search-photos"
          v-model="searchTerm"
          type="search"
          inputmode="text"
          name="search-photos"
          placeholder="Поиск"
          :class="classes.input"
          spellcheck="true"
          aria-label="Поиск фотографий"
        >
        <button
          :class="classes.iconButton"
          type="submit"
        >
          <SearchIcon
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
  border-bottom: 16px solid var(--color-weathered-stone);
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
  background-color: var(--background-color-primary);
  padding-left: 20px;
  padding-right: 50px;
  position: relative;
  border-radius: var(--border-radius-small);
}

.input {
  border: none;
  outline: none;
  padding: 21px 0;
  font-size: 24px;
  font-weight: 300;
  width: 100%;
  background-color: transparent;
  color: var(--text-color-default);
}

.input[type='search']::-webkit-search-decoration,
.input[type='search']::-webkit-search-cancel-button,
.input[type='search']::-webkit-search-results-button,
.input[type='search']::-webkit-search-results-decoration {
  display: none;
}

.input::placeholder {
  color: var(--text-color-default);
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
  color: var(--text-color-default);
  cursor: pointer;
}

.iconButton:focus-visible {
  outline: 3px dashed var(--text-color-default);
  outline-offset: 4px;
  border-radius: var(--border-radius-small);
}

@media screen and (width <= 796px) {
  .wrapper {
    height: 230px;
    border: none;
  }
}

:global(html:is(.dark)) .wrapper {
  border-bottom-color: var(--color-light-slate-grey);
}

@media screen and (width >= 796px) {
  .wrapper {
    background-image: url('/img/bg.jpg');
  }
}
</style>
