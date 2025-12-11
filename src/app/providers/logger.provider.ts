import type { LogLevel } from '@tf-app/shared/libs'
import type { Container } from 'ditox'
import { APP_CONFIG_TOKEN } from '@tf-app/shared/config'
import { createLogger, LOGGER_TOKEN } from '@tf-app/shared/libs'
import { injectable } from 'ditox'

export function loggerProvider(container: Container, opts?: {
  name?: string
  level?: LogLevel
  meta?: Record<string, unknown>
}) {
  const level: LogLevel
    = (localStorage.getItem('debug') === '1')
      ? 'trace'
      : (import.meta.env.DEV ? 'debug' : (opts?.level ?? 'warn'))

  container.bindFactory(LOGGER_TOKEN, injectable(config => createLogger({
    baseName: opts?.name ?? 'TheFactory',
    baseLevel: level,
    baseMeta: {
      version: __APP_VERSION__,
      build: __BUILD_TIME__,
    },
    dev: config.dev,
  }), APP_CONFIG_TOKEN))
}
