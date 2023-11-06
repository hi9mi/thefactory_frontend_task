import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'histoire'

export default defineConfig({
  // your Histoire configuration
  plugins: [HstVue()],
  setupFile: '/src/histoire.setup.ts',
  theme: {
    title: 'The factory',
    logo: {
      light: './public/img/logo.png',
      dark: './public/img/logo.png',
    },
    logoHref: 'https://thefactory-frontend-task.vercel.app/',
    favicon: './public/favicon.ico',
  },
  viteIgnorePlugins: ['vite-plugin-pwa:dev-sw', 'vite-plugin-pwa:build', 'vite-plugin-pwa:info', 'vite-plugin-pwa', 'html-plugin'],
  vite: {
    base: process.env.HISTOIRE_BASE || '/',
  },
})
