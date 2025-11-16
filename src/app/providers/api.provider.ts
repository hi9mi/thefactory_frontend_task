import type { Container } from 'ditox'
import { createUnsplashApi, UNSPLASH_API_TOKEN } from '@tf-app/shared/api'
import { APP_CONFIG_TOKEN } from '@tf-app/shared/config'
import { injectable } from 'ditox'

export function apiProvider(container: Container) {
  container.bindFactory(UNSPLASH_API_TOKEN, injectable(createUnsplashApi, APP_CONFIG_TOKEN), { scope: 'singleton' })
}
