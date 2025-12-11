import { token } from 'ditox'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'

// export interface LogEvent {
//   timestamp: string
//   level: LogLevel
//   name: string
//   message: string
//   data?: unknown
// }

type Context = Record<string, unknown>

export interface Logger {
  trace: (msg: string, data?: unknown, ctx?: Context) => void
  debug: (msg: string, data?: unknown, ctx?: Context) => void
  info: (msg: string, data?: unknown, ctx?: Context) => void
  warn: (msg: string, data?: unknown, ctx?: Context) => void
  error: (msg: string, err?: unknown, ctx?: Context) => void
  timer: (label: string) => { end: (extra?: Record<string, unknown>) => number }
  setLevel: (lvl: LogLevel) => void
  child: (name: string, meta?: Record<string, unknown>) => Logger
  // TODO: sending log event to server
  // send: (logEvent: LogEvent) => Promise<void>
}

export const LOGGER_TOKEN = token<Logger>('LOGGER_TOKEN')

const ORDER: Record<Exclude<LogLevel, 'silent'>, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
}

const COLOR_PALETTE = {
  white: '#ffffff',
  red: '#e84c3d',
  yellow: '#f39c11',
  green: '#18bb9c',
  blue: '#3598db',
  gray: '#808080',
  cyan: '#00ffff',
  magenta: '#ff00ff',
} as const

const LOG_LVL_STYLES = {
  trace: `color:${COLOR_PALETTE.gray};font-weight:700;`,
  debug: `color:${COLOR_PALETTE.gray};font-weight:700;`,
  info: `color:${COLOR_PALETTE.blue};font-weight:700;`,
  warn: `color:${COLOR_PALETTE.yellow};font-weight:700;`,
  error: `color:${COLOR_PALETTE.red};font-weight:700;`,
} as const

const LOG_LVL_EMOJIS = {
  trace: '🐛',
  debug: '🐛',
  info: 'ℹ️',
  warn: '⚠️',
  error: '🚨',
} as const

const LABEL_STYLES = `color:${COLOR_PALETTE.gray};font-weight:700;`
const SUBTITLE_STYLES = `color:${COLOR_PALETTE.gray};font-weight:300;`

function canLog(level: LogLevel, asked: keyof typeof ORDER) {
  if (level === 'silent')
    return false
  return ORDER[asked] >= ORDER[level]
}

const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
})

function createTS() {
  const ts = timeFmt.format(new Date())
  return ts
}

function tag(t: string) {
  return `%c[${t}]%c`
}

function printPayload(msg: string, data?: unknown, ctx?: Context, error?: Error) {
  console.log(tag('MESSAGE'), LABEL_STYLES, '', msg)

  if (error) {
    console.error(tag('ERROR'), LABEL_STYLES, '', error)
  }

  if (data !== undefined) {
    if (Array.isArray(data) && data.length) {
      console.log(tag('DATA'), LABEL_STYLES, '', data.slice(0, 200))
      if (data.length > 200)
        console.log(`%c(+${data.length - 200} more)%c`, SUBTITLE_STYLES, '')
    }
    else {
      console.log(tag('DATA'), LABEL_STYLES, '', data)
    }
  }

  if (ctx && Object.keys(ctx).length) {
    console.log(tag('CONTEXT'), LABEL_STYLES, '', ctx)
  }
}

interface LoggerOptions {
  baseName?: string
  baseLevel?: LogLevel
  baseMeta?: Record<string, unknown>
  dev?: boolean
  // onLogEvent?: (logEvent: LogEvent) => Promise<void>
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const { baseName = 'app', baseLevel = 'warn', baseMeta = {}, dev = false } = options

  let level = baseLevel

  const make = (name: string, meta?: Record<string, unknown>): Logger => {
    const fullName = name
    const metaAll = { ...baseMeta, ...meta }

    const handleLog = (
      logLevel: Exclude<LogLevel, 'silent'>,
      msg: string,
      data?: unknown,
      ctx?: Record<string, unknown>,
      error?: Error,
    ) => {
      const ts = createTS()

      if (dev) {
        const lvlStyle = LOG_LVL_STYLES[logLevel]
        const tsStyle = `color: ${COLOR_PALETTE.gray}; font-weight: 400;`
        const nameStyle = `color: ${COLOR_PALETTE.gray}; font-weight: 400;`
        const label = `%c[${ts}]%c  %c${LOG_LVL_EMOJIS[logLevel]} ${logLevel.toUpperCase()}%c  %c(${fullName})%c`

        console.groupCollapsed(label, tsStyle, '', lvlStyle, '', nameStyle, '')
        printPayload(msg, data, ctx, error)
        console.groupEnd()
      }
      else {
        const context = ctx ? { ctx: { ...metaAll, ...ctx } } : undefined
        const meta = context ?? (Object.keys(metaAll).length ? { ctx: metaAll } : undefined)
        const normalizeError = (err: unknown) => {
          if (err instanceof Error)
            return { name: err.name, message: err.message, stack: err.stack }
          if (err && typeof err === 'object') {
            const out: Record<string, unknown> = {}
            if ('name' in err)
              out.name = err.name
            if ('message' in err)
              out.message = err.message
            if ('stack' in err)
              out.stack = err.stack

            if (Object.keys(out).length)
              return out
          }
          return err
        }

        const entry = {
          level: ORDER[logLevel],
          time: Date.now(),
          name: fullName,
          message: msg,
          ...(Boolean(data) && { data }),
          ...(meta),
          ...(Boolean(error) && { error: normalizeError(error) }),
        }

        // TODO: make safe stringify
        console.log(JSON.stringify(entry))
      }

      // if (onLogEvent) {
      //   onLogEvent({
      //     timestamp: nowISO(),
      //     level: logLevel,
      //     name: fullName,
      //     message: msg,
      //     data: data || metaAll,
      //   })
      // }
    }

    const api: Logger = {
      trace: (msg, data, ctx) => {
        if (canLog(level, 'trace'))
          handleLog('trace', msg, data, ctx)
      },
      debug: (msg, data, ctx) => {
        if (canLog(level, 'debug'))
          handleLog('debug', msg, data, ctx)
      },
      info: (msg, data, ctx) => {
        if (canLog(level, 'info'))
          handleLog('info', msg, data, ctx)
      },
      warn: (msg, data, ctx) => {
        if (canLog(level, 'warn'))
          handleLog('warn', msg, data, ctx)
      },
      error: (msg, err, ctx) => {
        if (canLog(level, 'error')) {
          const error = err instanceof Error ? err : new Error(msg, { cause: err })

          handleLog('error', msg, undefined, ctx, error)
          if (typeof globalThis.reportError === 'function') {
            globalThis.reportError(err ?? new Error(String(msg)))
          }
        }
      },
      timer: (label: string) => {
        if (!dev)
          return { end: () => 0 }
        const id = `${fullName}:${label}:${Math.random().toString(36).slice(2)}`
        const start = performance.now()
        console.log('%c[⏳ START]%c', `color:${COLOR_PALETTE.gray};font-weight:700;`, '', id)
        return {
          end(extra) {
            const duration = +(performance.now() - start).toFixed(2)
            console.log(`%c[⏳ END] (${duration}ms)%c`, `color:${COLOR_PALETTE.gray};font-weight:700;`, '', { id, duration, ...extra })
            return duration
          },
        }
      },
      setLevel: lvl => level = lvl,
      child: (childName: string, childMeta?: Record<string, unknown>) => {
        const child = make(`${fullName}:${childName}`, { ...metaAll, ...childMeta })
        child.setLevel(level)
        return child
      },
    }

    return api
  }

  return make(baseName)
}
