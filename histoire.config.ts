import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'histoire'

export default defineConfig({
  // your Histoire configuration
  plugins: [HstVue()],
  setupFile: '/src/histoire.setup.ts',
  theme: {
    title: 'The factory',
    logo: {
      light: '/img/logo.png',
      dark: '/img/logo.png',
    },
    logoHref: '/',
    favicon: '/favicon.ico',
  },
})
