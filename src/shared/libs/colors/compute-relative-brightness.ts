export function computeRelativeBrightness(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}
