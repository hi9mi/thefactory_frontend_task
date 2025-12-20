import { token } from 'ditox'
import {
  COLOR_PALETTE,
  LABEL_STYLES,
  LOG_LVL_EMOJIS,
  LOG_LVL_STYLES,
  ORDER,
  SUBTITLE_STYLES,
  timeFmt,
} from './config'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'

export type Context = Record<string, unknown>

export type Meta = Record<string, unknown>

export interface LogEvent {
  level: LogLevel
  timestamp: number
  name: string
  message: string
  data?: unknown
  ctx?: Context
  error?: Error
}

export interface Transport {
  minLevel: LogLevel
  handle: (event: LogEvent) => void | Promise<void>
}

interface LogParams {
  msg: string
  data?: unknown
  ctx?: Context
  title?: string
}

interface LogErrorParams {
  msg: string
  ctx?: Context
  title?: string
  error?: Error
}

export interface Logger {
  trace: (params: LogParams) => void
  debug: (params: LogParams) => void
  info: (params: LogParams) => void
  warn: (params: LogParams) => void
  error: (params: LogErrorParams) => void
  timer: (label: string) => { end: (extra?: Meta) => number }
  setLevel: (lvl: LogLevel) => void
  child: (name: string, meta?: Meta) => Logger
}

export interface LoggerOptions {
  baseName?: string
  baseLevel?: LogLevel
  rootContext?: Record<string, unknown>
  dev?: boolean
  transports?: Transport[]
}

interface HandleLogParams {
  logLevel: Exclude<LogLevel, 'silent'>
  msg: string
  data?: unknown
  ctx?: Record<string, unknown>
  title?: string
  error?: Error
}

export const LOGGER_TOKEN = token<Logger>('LOGGER_TOKEN')

function canLog(level: LogLevel, asked: keyof typeof ORDER) {
  if (level === 'silent')
    return false
  return ORDER[asked] >= ORDER[level]
}

function createTS() {
  return timeFmt.format(new Date())
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

function safeStringify(obj: unknown, maxDepth = 10): string {
  const seen = new WeakSet()
  let depth = 0

  return JSON.stringify(obj, (key, value) => {
    if (key && depth > maxDepth) {
      return '[Max Depth Reached]'
    }

    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]'
      }
      seen.add(value)
      depth++
    }

    if (typeof value === 'function') {
      return `[Function: ${value.name || 'anonymous'}]`
    }

    if (typeof value === 'symbol') {
      return value.toString()
    }

    if (typeof value === 'bigint') {
      return `${value.toString()}n`
    }

    if (value === undefined) {
      return '[undefined]'
    }

    return value
  }, 2)
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const { baseName = 'app', baseLevel = 'warn', rootContext = {}, dev = false, transports = [] } = options

  let level = baseLevel

  const make = (name: string, ctx?: Record<string, unknown>): Logger => {
    const fullName = name
    const context = { ...rootContext, ...ctx }

    const handleLog = (
      { logLevel, msg, data, ctx, error, title }: HandleLogParams,
    ) => {
      const logName = title ? `${fullName}:${title}` : fullName

      if (dev) {
        const ts = createTS()
        const lvlStyle = LOG_LVL_STYLES[logLevel]
        const tsStyle = `color: ${COLOR_PALETTE.gray}; font-weight: 400;`
        const nameStyle = `color: ${COLOR_PALETTE.gray}; font-weight: 400;`
        const label = `%c[${ts}]%c  %c${LOG_LVL_EMOJIS[logLevel]} ${logLevel.toUpperCase()}%c  %c(${logName})%c`

        console.groupCollapsed(label, tsStyle, '', lvlStyle, '', nameStyle, '')
        printPayload(msg, data, ctx, error)
        console.groupEnd()
      }
      else {
        const mergedContext = ctx ? { ctx: { ...context, ...ctx } } : undefined
        const logContext = mergedContext ?? (Object.keys(context).length ? { ctx: context } : undefined)
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
          ...(logContext),
          ...(Boolean(error) && { error: normalizeError(error) }),
        }

        console.log(safeStringify(entry))
      }

      if (transports.length) {
        const event = {
          level: logLevel,
          timestamp: Date.now(),
          name: fullName,
          message: msg,
          ctx: { ...context, ctx },
          ...(Boolean(data) && { data }),
          error,
        }

        transports.forEach((transport) => {
          if (canLog(transport.minLevel, logLevel))
            transport.handle(event)
        })
      }
    }

    const api: Logger = {
      trace: ({ msg, data, ctx, title }) => {
        if (canLog(level, 'trace')) {
          handleLog({
            logLevel: 'trace',
            msg,
            data,
            ctx,
            title,
          })
        }
      },
      debug: ({ msg, data, ctx, title }) => {
        if (canLog(level, 'debug')) {
          handleLog({
            logLevel: 'debug',
            msg,
            data,
            ctx,
            title,
          })
        }
      },
      info: ({ msg, data, ctx, title }) => {
        if (canLog(level, 'info')) {
          handleLog({
            logLevel: 'info',
            msg,
            data,
            ctx,
            title,
          })
        }
      },
      warn: ({ msg, data, ctx, title }) => {
        if (canLog(level, 'warn')) {
          handleLog({
            logLevel: 'warn',
            msg,
            data,
            ctx,
            title,
          })
        }
      },
      error: ({ msg, error, ctx, title }) => {
        if (canLog(level, 'error')) {
          const logError = error instanceof Error ? error : new Error(msg, { cause: error })

          handleLog({
            logLevel: 'error',
            msg,
            error: logError,
            ctx,
            title,
          })
          if (typeof globalThis.reportError === 'function') {
            globalThis.reportError(logError)
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
      child: (childName: string, childContext?: Record<string, unknown>) => {
        const child = make(`${fullName}:${childName}`, { ...context, ...childContext })
        child.setLevel(level)
        return child
      },
    }

    return api
  }

  return make(baseName)
}
