<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

import SunAndMoonIcon from '~icons/tf-icons/sun-and-moon'

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
    id="toggle-theme-btn"
    :aria-label="isDarkTheme ? 'Toggle Dark theme' : 'Toggle Light theme'"
    title="Toggles light & dark theme"
    aria-live="polite"
    type="button"
    :class="classes.button"
    data-testid="toggle-theme-btn"
    @click="toggleDark()"
  >
    <SunAndMoonIcon :class="classes.sunAndMoon" data-animated />
  </button>
</template>

<style module="classes">
.button {
  --size: 23px;
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
    --size: 23px;
  }
}

.button:focus-visible {
  outline: 3px dashed var(--icon-fill);
  outline-offset: 4px;
}

.button > svg {
  inline-size: 100%;
  block-size: 100%;
  stroke-linecap: round;
}

.sunAndMoon > :is(:global(.moon), :global(.sun), :global(.sunBeams)) {
  transform-origin: center center;
}

.sunAndMoon > :is(:global(.moon), :global(.sun)) {
  fill: var(--icon-fill);
}

.sunAndMoon > :global(.sunBeams) {
  stroke: var(--icon-fill);
  stroke-width: 2px;
}

.sunAndMoon :global(.sunBeams) {
  transition:
    transform 0.5s var(--ease-elastic-4),
    opacity 0.5s var(--ease-3) !important;
}

:global(html:is(.dark)) .sunAndMoon > :global(.sunBeams) {
  transform: rotateZ(-25deg);
  transition-duration: 0.15s;
  opacity: 0;
}

.button:is(:hover, :focus-visible) .sunAndMoon > :is(:global(.moon), :global(.sun)) {
  fill: var(--icon-fill-hover);
}

.button:is(:hover, :focus-visible) .sunAndMoon > :global(.sunBeams) {
  stroke: var(--icon-fill-hover);
}

.sunAndMoon > :global(.sun) {
  transition: transform 0.5s var(--ease-elastic-3) !important;
}

.sunAndMoon :global(.moon) > circle {
  transition: transform 0.25s var(--ease-out-5) !important;

  @supports (cx: 1) {
    transition: cx 0.25s var(--ease-out-5) !important;
  }
}

:global(html:is(.dark)) .button {
  --icon-fill: #e29800;
  --icon-fill-hover: #c28200;
}

:global(html:is(.dark)) .sunAndMoon > :global(.sun) {
  transform: scale(1.75);
  transition-timing-function: var(--ease-3);
  transition-duration: 0.25s;
}

:global(html:is(.dark)) .sunAndMoon > :global(.moon) > circle {
  transform: translateX(-7px);

  @supports (cx: 1) {
    transform: translateX(0);
    cx: 17;
  }
}

:global(html:is(.dark)) .sunAndMoon :global(.moon) > circle {
  transition-delay: 0.25s;
  transition-duration: 0.5s;
}
</style>
