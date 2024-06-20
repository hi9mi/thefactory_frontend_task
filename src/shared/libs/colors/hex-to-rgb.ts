export function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '')

  const validHexRegex = /^(?:[a-f\d]{3}){1,2}$/i
  if (!validHexRegex.test(hex))
    return { r: 0, g: 0, b: 0 }

  if (hex.length === 3)
    hex = hex.replace(/(.)/g, '$1$1')

  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b))
    return { r: 0, g: 0, b: 0 }

  return { r, g, b }
}
