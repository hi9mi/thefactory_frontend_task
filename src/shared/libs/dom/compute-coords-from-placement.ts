export interface ElementRects {
  anchorRect: DOMRect
  floatRect: DOMRect
}

export type Placement
  = | 'bottom'
    | 'right'
    | 'left'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start'

export function addScroll(coords: { x: number, y: number }) {
  coords.x += window.scrollX
  coords.y += window.scrollY
  return coords
}

export function computeCommonX(anchorRect: DOMRect, floatRect: DOMRect) {
  return anchorRect.x + anchorRect.width / 2 - floatRect.width / 2
}

export function computeCommonY(anchorRect: DOMRect, floatRect: DOMRect) {
  return anchorRect.y + anchorRect.height / 2 - floatRect.height / 2
}

export function adjustPositionWithinViewport(coords: { x: number, y: number }, floatRect: DOMRect) {
  const viewportWidth = document.documentElement.clientWidth + window.scrollX
  const viewportHeight = document.documentElement.clientHeight + window.scrollY

  if (coords.x < 0)
    coords.x = window.scrollX
  else if (coords.x + floatRect.width > viewportWidth)
    coords.x = viewportWidth + scrollX - floatRect.width

  if (coords.y < 0)
    coords.y = window.scrollY
  else if (coords.y + floatRect.height > viewportHeight)
    coords.y = viewportHeight + scrollY - floatRect.height

  return coords
}

const placementStrategies = {
  'top': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: computeCommonX(anchorRect, floatRect),
    y: anchorRect.y - floatRect.height - offset,
  }),
  'right': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: anchorRect.x + anchorRect.width + offset,
    y: computeCommonY(anchorRect, floatRect),
  }),
  'left': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: anchorRect.x - floatRect.width - offset,
    y: computeCommonY(anchorRect, floatRect),
  }),
  'bottom': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: computeCommonX(anchorRect, floatRect),
    y: anchorRect.y + anchorRect.height + offset,
  }),
  'bottom-end': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: anchorRect.x + anchorRect.width - floatRect.width,
    y: anchorRect.y + anchorRect.height + offset,
  }),
  'bottom-start': (anchorRect: DOMRect, _: DOMRect, offset: number) => ({
    x: anchorRect.x,
    y: anchorRect.y + anchorRect.height + offset,
  }),
  'left-end': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: anchorRect.x - floatRect.width - offset,
    y: anchorRect.y + anchorRect.height - floatRect.height,
  }),
  'left-start': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: anchorRect.x - floatRect.width - offset,
    y: anchorRect.y,
  }),
  'right-end': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: anchorRect.x + anchorRect.width + offset,
    y: anchorRect.y + anchorRect.height - floatRect.height,
  }),
  'right-start': (anchorRect: DOMRect, _: DOMRect, offset: number) => ({
    x: anchorRect.x + anchorRect.width + offset,
    y: anchorRect.y,
  }),
  'top-end': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: anchorRect.x + anchorRect.width - floatRect.width,
    y: anchorRect.y - floatRect.height - offset,
  }),
  'top-start': (anchorRect: DOMRect, floatRect: DOMRect, offset: number) => ({
    x: anchorRect.x,
    y: anchorRect.y - floatRect.height - offset,
  }),
}

export function computeCoordsFromPlacement({ anchorRect, floatRect }: ElementRects, placement: Placement, offset = 10) {
  const computeCoords = placementStrategies[placement]

  if (!computeCoords)
    throw new Error(`Invalid placement: ${placement}`)

  let coords = computeCoords(anchorRect, floatRect, offset)
  coords = addScroll(coords)
  coords = adjustPositionWithinViewport(coords, floatRect)

  return coords
}
