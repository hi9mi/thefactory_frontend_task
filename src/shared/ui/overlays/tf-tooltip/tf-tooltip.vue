<script setup lang="ts">
import type { Placement } from '@tf-app/shared/libs/dom/compute-coords-from-placement'

import { computeCoordsFromPlacement } from '@tf-app/shared/libs/dom/compute-coords-from-placement'
import { reactive, ref, shallowRef, useId, watch } from 'vue'

const props = withDefaults(defineProps<{
  id?: string
  label: string
  position?: Placement
  offset?: number
  multiline?: boolean
}>(), {
  position: 'top',
  offset: 10,
})

const id = props.id ?? useId()

const TOOLTIPS_CONTAINER_ID = '__TOOLTIPS_CONTAINER__'
if (!document.getElementById(TOOLTIPS_CONTAINER_ID)) {
  const tooltipsContainer = document.createElement('div')
  tooltipsContainer.id = TOOLTIPS_CONTAINER_ID
  document.body.append(tooltipsContainer)
}

const anchorElement = shallowRef<HTMLElement | null>(null)
const tooltipElement = shallowRef<HTMLElement | null>(null)
const tooltipCoords = reactive({
  '--tooltip-left': '0',
  '--tooltip-top': '0',
})
const isShowTooltip = ref(false)

function showFrom(event: Event) {
  anchorElement.value = event.currentTarget as HTMLElement
  isShowTooltip.value = true
}
function hide() {
  isShowTooltip.value = false
  anchorElement.value = null
}
function onMouseEnter(event: Event) {
  showFrom(event)
}
function onMouseLeave() {
  hide()
}
function onFocus(event: FocusEvent) {
  showFrom(event)
}
function onBlur() {
  hide()
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    hide()
}

watch(tooltipElement, () => {
  if (!anchorElement.value || !tooltipElement.value)
    return

  const coords = computeCoordsFromPlacement({
    anchorRect: anchorElement.value.getBoundingClientRect(),
    floatRect: tooltipElement.value.getBoundingClientRect(),
  }, props.position, props.offset)

  tooltipCoords['--tooltip-left'] = `${coords.x}px`
  tooltipCoords['--tooltip-top'] = `${coords.y}px`
})
</script>

<template>
  <Teleport :to="`#${TOOLTIPS_CONTAINER_ID}`">
    <Transition
      name="tooltip"
      data-animated
    >
      <div
        v-if="isShowTooltip"
        :id="id"

        ref="tooltipElement"
        role="tooltip"
        :style="tooltipCoords"
        :class="{
          [classes.tooltip]: true,
          [classes.multiline]: multiline,
        }"
      >
        {{ label }}
      </div>
    </Transition>
  </Teleport>
  <slot
    name="anchor"
    :describedby="id"
    :labelledby="id"
    :on-mouse-enter="onMouseEnter"
    :on-mouse-leave="onMouseLeave"
    :on-focus="onFocus"
    :on-blur="onBlur"
    :on-keydown="onKeydown"
    :on-touch-start="onFocus"
    :on-touch-end="onBlur"
  />
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.3s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}

.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
}
</style>

<style module="classes">
.tooltip {
  position: absolute;
  left: var(--tooltip-left, 0);
  top: var(--tooltip-top, 0);
  z-index: 1000;
  max-width: 200px;
  width: max-content;
  word-wrap: break-word;
  border-radius: var(--border-radius-medium, 8px);
  background-color: var(--background-color-main, #fff);
  padding: 4px 8px;
  font-size: 14px;
  color: var(--text-color-default, #000);
  box-shadow: var(--shadow-small, 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%));
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.multiline {
  line-clamp: unset;
  -webkit-line-clamp: unset;
}
</style>
