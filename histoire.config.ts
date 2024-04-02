import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'histoire'

export default defineConfig({
  // your Histoire configuration
  plugins: [HstVue()],
  setupFile: '/src/histoire.setup.ts',
  theme: {
    title: 'The factory',
    logo: {
      light: './src/shared/assets/logo.png',
      dark: './src/shared/assets/logo.png',
      square: './src/shared/assets/logo.png',
    },
    logoHref: 'https://thefactory-frontend-task.vercel.app/',
    favicon: '/favicon.ico',
    defaultColorScheme: 'light',
  },
  viteIgnorePlugins: ['vite-plugin-pwa:dev-sw', 'vite-plugin-pwa:build', 'vite-plugin-pwa:info', 'vite-plugin-pwa', 'html-plugin'],
  vite: {
    base: process.env.HISTOIRE_BASE || '/',
  },
})
