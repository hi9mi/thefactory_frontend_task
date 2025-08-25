import { beforeEach, describe, expect, it, vi } from 'vitest'

const { activate, deactivate, createFocusTrapMock, SUT_PATH } = vi.hoisted(() => {
  const activate = vi.fn()
  const deactivate = vi.fn()
  const createFocusTrapMock = vi.fn(() => ({ activate, deactivate }))
  const SUT_PATH = './use-focus-trap'
  return { activate, deactivate, createFocusTrapMock, SUT_PATH }
})

vi.mock('focus-trap', () => ({
  createFocusTrap: createFocusTrapMock,
}))

let useFocusTrap: (opts?: any) => {
  trapRef: { value: HTMLElement | null }
  initFocusTrap: (opts?: any) => void
  clearFocusTrap: () => void
}
let FT: typeof import('focus-trap')

async function fresh() {
  vi.resetModules()
  FT = await import('focus-trap')
  const mod = await import(SUT_PATH)
  useFocusTrap = mod.useFocusTrap
  createFocusTrapMock.mockClear()
  activate.mockClear()
  deactivate.mockClear()
}

beforeEach(async () => {
  await fresh()
})

describe('useFocusTrap', () => {
  it('should not create a trap when no element is set and init is called', () => {
    const { initFocusTrap } = useFocusTrap()
    initFocusTrap()
    expect(FT.createFocusTrap).not.toHaveBeenCalled()
    expect(activate).not.toHaveBeenCalled()
  })

  it('should create and activate a trap when trapRef is set to an element', () => {
    const el = document.createElement('div')
    const options = { escapeDeactivates: false } as any

    const { trapRef } = useFocusTrap(options)
    trapRef.value = el

    expect(FT.createFocusTrap).toHaveBeenCalledTimes(1)
    expect(FT.createFocusTrap).toHaveBeenCalledWith(el, options)
    expect(activate).toHaveBeenCalledTimes(1)
  })

  it('should pass provided options to createFocusTrap', () => {
    const el = document.createElement('div')
    const opts = { allowOutsideClick: true } as any

    const { trapRef } = useFocusTrap(opts)
    trapRef.value = el

    expect(FT.createFocusTrap).toHaveBeenCalledWith(el, opts)
  })

  it('should deactivate the trap when clearFocusTrap is called', () => {
    const el = document.createElement('div')
    const { trapRef, clearFocusTrap } = useFocusTrap()

    trapRef.value = el
    expect(activate).toHaveBeenCalled()

    clearFocusTrap()
    expect(deactivate).toHaveBeenCalledTimes(1)

    expect(() => clearFocusTrap()).not.toThrow()
    expect(deactivate).toHaveBeenCalledTimes(1)
  })

  it('should deactivate the trap when trapRef is set to null', () => {
    const el = document.createElement('div')
    const { trapRef } = useFocusTrap()

    trapRef.value = el
    expect(activate).toHaveBeenCalled()

    trapRef.value = null as unknown as HTMLElement
    expect(deactivate).toHaveBeenCalledTimes(1)
  })

  it('should support reusing after deactivation (set element again)', () => {
    const el = document.createElement('div')
    const { trapRef, clearFocusTrap } = useFocusTrap()

    trapRef.value = el
    expect(activate).toHaveBeenCalledTimes(1)

    clearFocusTrap()
    expect(deactivate).toHaveBeenCalledTimes(1)

    trapRef.value = el
    expect(activate).toHaveBeenCalledTimes(2)
    expect(FT.createFocusTrap).toHaveBeenCalledTimes(2)
  })

  it('should deactivate the previous trap when switching element without clearing', () => {
    const elA = document.createElement('div')
    const elB = document.createElement('div')
    const { trapRef, clearFocusTrap } = useFocusTrap()

    trapRef.value = elA
    expect(activate).toHaveBeenCalledTimes(1)
    expect(deactivate).toHaveBeenCalledTimes(0)

    trapRef.value = elB
    expect(activate).toHaveBeenCalledTimes(2)
    expect(deactivate).toHaveBeenCalledTimes(1)

    clearFocusTrap()
    expect(deactivate).toHaveBeenCalledTimes(2)
  })
})
