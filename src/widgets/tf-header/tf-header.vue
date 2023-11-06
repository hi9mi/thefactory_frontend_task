<script setup lang="ts">
import VueInlineSvg from 'vue-inline-svg'
import { useRoute } from 'vue-router'

import { routes } from '@tf-app/routing'
import heartIcon from '@tf-app/shared/assets/icons/heart.svg'
import searchIcon from '@tf-app/shared/assets/icons/search.svg'
import { TfThemeSwitcher } from '@tf-app/shared/ui/buttons/tf-theme-switcher'

const route = useRoute()
</script>

<template>
  <header :class="classes.header">
    <div class="container" :class="classes.headerWrapper">
      <img
        src="/img/logo.png"
        alt="logo"
        :class="classes.logo"
      >

      <div :class="classes.navWrapper">
        <nav :class="classes.links">
          <RouterLink
            v-if="route.path !== routes.gallery.path"
            :to="routes.gallery.path"
            :class="classes.link"
          >
            <VueInlineSvg
              :src="searchIcon"
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
            <VueInlineSvg
              :src="heartIcon"
              fill="none"
              width="23"
              height="21"
              aria-label="Избранное"
            />
            <span :class="classes.linkText">Избранное</span>
          </RouterLink>
        </nav>
        <TfThemeSwitcher />
      </div>
    </div>
  </header>
</template>

<style module="classes">
.header {
  background-color: var(--c-eerie-black);
  height: 148px;
  display: flex;
  align-items: center;
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
  color: var(--c-white);
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
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
