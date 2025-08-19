import type { App, InjectionKey } from 'vue'
import type { DependencyModule, DI, Token } from './container'
import { inject, provide } from 'vue'
import { applyModules, createChildDI, createDI } from './container'

const DiKey: InjectionKey<DI> = Symbol('Di')

export function createDiPlugin(rootDi: DI) {
  return {
    install(app: App) {
      app.provide(DiKey, rootDi)
    },
  }
}

export function useDependencyContainer(): DI {
  const di = inject(DiKey)
  if (!di)
    throw new Error('DI container is not provided')
  return di
}

export function useDependency<T>(t: Token<T>): T {
  return useDependencyContainer().get(t)
}

export function useOptionalDependency<T>(t: Token<T>): T | undefined {
  return useDependencyContainer().tryGet(t)
}

export function provideScopedDI(
  seed?: Record<Token<any>, any>,
  ...modules: DependencyModule[]
): DI {
  const parent = inject(DiKey)
  if (!parent)
    throw new Error('No parent DI to scope from')
  const child = createChildDI(parent, seed)
  if (modules.length)
    applyModules(child, ...modules)
  provide(DiKey, child)
  return child
}

export function provideIsolatedDI(
  seed?: Record<Token<any>, any>,
  ...modules: DependencyModule[]
): DI {
  const isolated = createDI(seed)
  if (modules.length)
    applyModules(isolated, ...modules)
  provide(DiKey, isolated)
  return isolated
}
