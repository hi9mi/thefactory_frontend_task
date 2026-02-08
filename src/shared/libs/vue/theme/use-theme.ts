import type { UseDarkOptions } from '@vueuse/core'
import { useDark, useToggle } from '@vueuse/core'

export function useTheme(options: UseDarkOptions = {}) {
  const isDark = useDark(options)
  const toggle = useToggle(isDark)

  return {
    isDark,
    toggle,
  }
}
