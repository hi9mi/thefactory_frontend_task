import { customRef } from 'vue'
import type { FocusTrap, Options } from 'focus-trap'
import { createFocusTrap } from 'focus-trap'

export function useFocusTrap(focusTrapArgs?: Options) {
  const trapRef = customRef((track, trigger) => {
    let $trapEl: HTMLElement | null = null
    return {
      get() {
        track()
        return $trapEl
      },
      set(value) {
        $trapEl = value
        value ? initFocusTrap(focusTrapArgs) : clearFocusTrap()
        trigger()
      },
    }
  })

  let trap: FocusTrap | null = null
  function initFocusTrap(focusTrapArgs?: Options) {
    if (!trapRef.value)
      return
    trap = createFocusTrap(trapRef.value, focusTrapArgs)
    trap.activate()
  }

  function clearFocusTrap() {
    trap?.deactivate()
    trap = null
  }

  return {
    trapRef,
    initFocusTrap,
    clearFocusTrap,
  }
}
