<script setup lang="ts">
import ToggleTheme from '@tf-app/features/toggle-theme/toggle-theme.vue'
import { routes } from '@tf-app/routing'

import HeartIcon from '~icons/tf-icons/heart'
import SearchIcon from '~icons/tf-icons/search'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showSearchIcon = computed(() => {
  return route.path !== routes.search.path
})
</script>

<template>
  <header :class="classes.header">
    <div class="container" :class="classes.headerWrapper">
      <RouterLink
        :to="routes.gallery.path"
        title="На главную"
      >
        <img
          src="/img/logo.png"
          alt="logo"
          :class="classes.logo"
        >
      </RouterLink>

      <div :class="classes.navWrapper">
        <nav :class="classes.links">
          <RouterLink
            v-if="showSearchIcon"
            :to="routes.search.path"
            :class="classes.link"
          >
            <SearchIcon
              fill="none"
              width="23"
              height="23"
              aria-label="Поиск"
            />
            <span :class="classes.linkText">Поиск</span>
          </RouterLink>
          <RouterLink
            :to="routes.favorites.path"
            :class="classes.link"
          >
            <HeartIcon
              fill="none"
              width="23"
              height="21"
              aria-label="Избранное"
            />
            <span :class="classes.linkText">Избранное</span>
          </RouterLink>
        </nav>
        <ToggleTheme />
      </div>
    </div>
  </header>
</template>

<style module="classes">
.header {
  background-color: var(--color-eerie-black);
  height: 148px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 100;
}

.logo {
  max-width: 185px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.navWrapper {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  align-items: center;
}

.links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.link {
  color: var(--color-white);
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.link:focus-visible {
  outline: 3px dashed var(--color-white);
  outline-offset: 4px;
  border-radius: var(--border-radius-medium);
}

.linkText {
  font-size: 18px;
}

.headerWrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

@media screen and (width <= 560px) {
  .linkText {
    display: none;
  }
}
</style>
