import type { LogLevel } from './core'

export const ORDER: Record<Exclude<LogLevel, 'silent'>, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
}

export const COLOR_PALETTE = {
  white: '#ffffff',
  red: '#e84c3d',
  yellow: '#f39c11',
  green: '#18bb9c',
  blue: '#3598db',
  gray: '#808080',
  cyan: '#00ffff',
  magenta: '#ff00ff',
} as const

export const LOG_LVL_STYLES = {
  trace: `color:${COLOR_PALETTE.gray};font-weight:700;`,
  debug: `color:${COLOR_PALETTE.gray};font-weight:700;`,
  info: `color:${COLOR_PALETTE.blue};font-weight:700;`,
  warn: `color:${COLOR_PALETTE.yellow};font-weight:700;`,
  error: `color:${COLOR_PALETTE.red};font-weight:700;`,
} as const

export const LOG_LVL_EMOJIS = {
  trace: '🐛',
  debug: '🐛',
  info: 'ℹ️',
  warn: '⚠️',
  error: '🚨',
} as const

// TODO: make functions
export const LABEL_STYLES = `color:${COLOR_PALETTE.gray};font-weight:700;`
export const SUBTITLE_STYLES = `color:${COLOR_PALETTE.gray};font-weight:300;`

export const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
})
