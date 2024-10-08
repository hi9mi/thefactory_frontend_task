import { defineSetupVue3 } from '@histoire/plugin-vue'

import StoryWrapper from './shared/ui/histoire/story-wrapper.vue'

import './app/styles/index.css'

export const setupVue3 = defineSetupVue3(({ addWrapper }) => {
  addWrapper(StoryWrapper)
})
