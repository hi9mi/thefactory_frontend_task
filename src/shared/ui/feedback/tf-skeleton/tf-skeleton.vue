<script lang="ts" setup>
import { computed, type CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'block' | 'inline'
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  maxWidth?: CSSProperties['maxWidth']
  radius?: CSSProperties['borderRadius']
}>(), {
  type: 'block',
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  radius: 'var(--border-radius-small)',
})
const element = computed(() => props.type === 'block' ? 'div' : 'span')

const styleObject = computed(() => ({
  width: convertValueToPx(props.width),
  height: convertValueToPx(props.height),
  maxWidth: convertValueToPx(props.maxWidth),
  borderRadius: convertValueToPx(props.radius),
}))

function convertValueToPx(value: string | number) {
  if (typeof value === 'number')
    return `${value}px`
  return value
}
</script>

<template>
  <component :is="element" :class="[classes.skeleton, classes[props.type]]" :style="styleObject" aria-hidden="true" />
</template>

<style module="classes">
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: var(--color-weathered-stone);
}

.skeleton.inline {
  display: inline-block;
  line-height: 1;
}

.skeleton::after {
  display: block;
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    90deg,
    var(--color-weathered-stone),
    var(--color-white-smoke),
    var(--color-weathered-stone)
  );
  background-repeat: no-repeat;
  transform: translateX(-100%);
  animation-name: skeleton;
  animation-direction: normal;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes skeleton {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}
</style>
