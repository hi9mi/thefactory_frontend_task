<script setup lang="ts">
import VueInlineSvg from "vue-inline-svg";
import { useRoute } from "vue-router";

import { routes } from "@tf-app/routing";
import heartIcon from "@tf-app/shared/assets/icons/heart.svg";
import searchIcon from "@tf-app/shared/assets/icons/search.svg";

const route = useRoute();
</script>

<template>
  <header class="header">
    <div class="container header_wrapper">
      <img
        src="/logo.png"
        alt="logo"
      />
      <div class="links">
        <RouterLink
          v-if="route.path !== routes.gallery.path"
          :to="routes.gallery.path"
          class="link"
        >
          <vue-inline-svg
            :src="searchIcon"
            fill="none"
            width="23"
            height="23"
            aria-label="Поиск"
          />
          <span class="link_text">Поиск</span>
        </RouterLink>
        <RouterLink
          :to="routes.favorites.path"
          class="link"
        >
          <vue-inline-svg
            :src="heartIcon"
            fill="none"
            width="23"
            height="21"
            aria-label="Избранное"
          />
          <span class="link_text">Избранное</span>
        </RouterLink>
      </div>
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

.link_text {
  font-size: 18px;
}

.header_wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
}
@media screen and (max-width: 560px) {
  .link_text {
    display: none;
  }
}
</style>
