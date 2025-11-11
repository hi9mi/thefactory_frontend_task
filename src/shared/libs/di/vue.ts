import type { Container, Token } from 'ditox'
import type { App, InjectionKey } from 'vue'
import { createContainer } from 'ditox'
import { defineAsyncComponent, defineComponent, h, inject, onUnmounted, provide } from 'vue'

const DiKey: InjectionKey<Container> = Symbol('Di')

export function createDiPlugin(root: Container) {
  return {
    install(app: App) {
      app.provide(DiKey, root)
    },
  }
}

export function useDi() {
  const container = inject(DiKey)
  if (!container)
    throw new Error('[Ditox Error] container is not provided')
  return container
}

export function useDependency<T>(token: Token<T>, container?: Container): T {
  const c = container ?? useDi()
  const value = c.resolve<T>(token)

  return value
}

export function useOptionalDependency<T>(token: Token<T>, container?: Container): T | undefined {
  const c = container ?? useDi()
  const value = c.get<T>(token)

  return value
}

export function provideScopedDI(overrides?: (container: Container) => void) {
  const parent = useDi()
  const child = createContainer(parent)

  overrides?.(child)
  provide(DiKey, child)
  onUnmounted(() => child.removeAll())
  return child
}

export function provideIsolatedDI(binder?: (container: Container) => void) {
  const isolated = createContainer()

  binder?.(isolated)
  provide(DiKey, isolated)
  onUnmounted(() => isolated.removeAll())
}

export function withDiScope<TComp = any>(
  loader: () => Promise<{ default: TComp }>,
  bind?: (c: Container) => void,
) {
  const AsyncInner = defineAsyncComponent(loader)

  return defineComponent({
    name: 'WithDiScope',
    setup(_, { attrs, slots }) {
      provideScopedDI(bind)

      return () => h(AsyncInner, attrs, slots)
    },
  })
}
