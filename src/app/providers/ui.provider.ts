import type { Container } from 'ditox'
import { createNotifier, NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import { injectable } from 'ditox'

export function uiProvider(container: Container) {
  container.bindFactory(NOTIFIER_TOKEN, injectable(createNotifier), { scope: 'singleton' })
}
