import type { FocusTrap, Options } from 'focus-trap'
import { createFocusTrap } from 'focus-trap'
import { customRef } from 'vue'

export function useFocusTrap(focusTrapArgs?: Options) {
  let trap: FocusTrap | null = null
  let boundEl: HTMLElement | null = null

  const trapRef = customRef((track, trigger) => {
    let $trapEl: HTMLElement | null = null
    return {
      get() {
        track()
        return $trapEl
      },
      set(value) {
        const changed = value !== $trapEl
        $trapEl = value
        if (value) {
          if (changed || !trap)
            initFocusTrap(focusTrapArgs)
        }
        else {
          clearFocusTrap()
        }
        trigger()
      },
    }
  })

  function initFocusTrap(focusTrapArgs?: Options) {
    if (!trapRef.value)
      return
    if (trap && boundEl === trapRef.value)
      return
    trap?.deactivate()
    trap = createFocusTrap(trapRef.value, focusTrapArgs)
    boundEl = trapRef.value
    trap.activate()
  }

  function clearFocusTrap() {
    trap?.deactivate()
    trap = null
    boundEl = null
  }

  return {
    trapRef,
    initFocusTrap,
    clearFocusTrap,
  }
}
