<script setup lang="ts">
import VueInlineSvg from 'vue-inline-svg'
import { useDark, useToggle } from '@vueuse/core'

import sunAndMoonIcon from '@tf-app/shared/assets/icons/sun-and-moon.svg'

const isDarkTheme = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDarkTheme)
</script>

<template>
  <button
    id="theme-switcher"
    :aria-label="isDarkTheme ? 'Toggle Dark theme' : 'Toggle Light theme'"
    title="Toggles light & dark theme"
    aria-live="polite"
    type="button"
    class="themeSwitcherButton"
    @click="toggleDark()"
  >
    <VueInlineSvg :src="sunAndMoonIcon" class="sunAndMoon" />
  </button>
</template>

<style>
.themeSwitcherButton {
  --size: 2rem;
  --icon-fill: #ffce6a;
  --icon-fill-hover: #ffd47c;

  background: none;
  border: none;
  padding: 0;
  inline-size: var(--size);
  block-size: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 5px;
  outline: transparent solid 2px;

  @media (hover: none) {
    --size: 48px;
  }
}

.themeSwitcherButton:focus-visible {
  outline-color: var(--icon-fill);
}

.themeSwitcherButton > svg {
  inline-size: 100%;
  block-size: 100%;
  stroke-linecap: round;
}

.sunAndMoon > :is(.moon, .sun, .sunBeams) {
  transform-origin: center center;
}

.sunAndMoon > :is(.moon, .sun) {
  fill: var(--icon-fill);
}

.sunAndMoon > .sunBeams {
  stroke: var(--icon-fill);
  stroke-width: 2px;
}

.sunAndMoon .sunBeams {
  transition:
    transform 0.5s var(--ease-elastic-4),
    opacity 0.5s var(--ease-3) !important;
}

html:is(.dark) .sunAndMoon > .sunBeams {
  transform: rotateZ(-25deg);
  transition-duration: 0.15s;
  opacity: 0;
}

.themeSwitcherButton:is(:hover, :focus-visible) .sunAndMoon > :is(.moon, .sun) {
  fill: var(--icon-fill-hover);
}

.themeSwitcherButton:is(:hover, :focus-visible) .sunAndMoon > .sunBeams {
  stroke: var(--icon-fill-hover);
}

.sunAndMoon > .sun {
  transition: transform 0.5s var(--ease-elastic-3) !important;
}

.sunAndMoon .moon > circle {
  transition: transform 0.25s var(--ease-out-5) !important;

  @supports (cx: 1) {
    transition: cx 0.25s var(--ease-out-5) !important;
  }
}

html:is(.dark) .themeSwitcherButton {
  --icon-fill: #e29800;
  --icon-fill-hover: #c28200;
}

html:is(.dark) .sunAndMoon > .sun {
  transform: scale(1.75);
  transition-timing-function: var(--ease-3);
  transition-duration: 0.25s;
}

html:is(.dark) .sunAndMoon > .moon > circle {
  transform: translateX(-7px);

  @supports (cx: 1) {
    transform: translateX(0);
    cx: 17;
  }
}

html:is(.dark) .sunAndMoon .moon > circle {
  transition-delay: 0.25s;
  transition-duration: 0.5s;
}
</style>
