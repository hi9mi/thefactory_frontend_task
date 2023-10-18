<script setup lang="ts">
import VueInlineSvg from 'vue-inline-svg'
import { useRoute } from 'vue-router'

import { routes } from '@tf-app/routing'
import heartIcon from '@tf-app/shared/assets/icons/heart.svg'
import searchIcon from '@tf-app/shared/assets/icons/search.svg'

const route = useRoute()
</script>

<template>
  <header class="header">
    <div class="container header-wrapper">
      <img
        src="/logo.png"
        alt="logo"
      >
      <nav class="links">
        <RouterLink
          v-if="route.path !== routes.gallery.path"
          :to="routes.gallery.path"
          class="link"
        >
          <VueInlineSvg
            :src="searchIcon"
            fill="none"
            width="23"
            height="23"
            aria-label="Поиск"
          />
          <span class="link-text">Поиск</span>
        </RouterLink>
        <RouterLink
          :to="routes.favorites.path"
          class="link"
        >
          <VueInlineSvg
            :src="heartIcon"
            fill="none"
            width="23"
            height="21"
            aria-label="Избранное"
          />
          <span class="link-text">Избранное</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #000;
  height: 148px;
  display: flex;
  align-items: center;
}

.links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.link {
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.link-text {
  font-size: 18px;
}

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

@media screen and (width <= 560px) {
  .link-text {
    display: none;
  }
}
</style>
