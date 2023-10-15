<script setup lang="ts">
import VueInlineSvg from 'vue-inline-svg'

import searchIcon from '@tf-app/shared/assets/icons/search.svg'

const modelValue = defineModel<string>()
</script>

<template>
  <div class="wrapper">
    <picture>
      <source
        media="(max-width: 376px)"
        srcset="/bg-mobile.jpg"
      >
      <img
        class="bg"
        src="/bg-mobile.jpg"
        alt=""
        role="presentation"
      >
    </picture>
    <div class="container search-container">
      <form
        class="form"
        @submit.prevent
      >
        <input
          id="search"
          v-model="modelValue"
          type="text"
          inputmode="text"
          name="search"
          placeholder="Поиск"
          class="input"
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
