import { defineSetupVue3 } from '@histoire/plugin-vue'

import StoryWrapper from './shared/ui/histoire/story-wrapper.vue'

export const setupVue3 = defineSetupVue3(({ addWrapper }) => {
  // https://github.com/histoire-dev/histoire/issues/339#issuecomment-1522329599
  const isIframe = globalThis.self !== globalThis.top
  document.head
    .querySelectorAll('style[type=\'text/css\']:not([data-vite-dev-id*=\'histoire\'])')
    .forEach(style => isIframe || style.remove())

  addWrapper(StoryWrapper)
})
