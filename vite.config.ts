/// <reference types="vitest" />
/// <reference types="histoire" />
import path from 'node:path'

import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import webfontDownload from 'vite-plugin-webfont-dl'

import { APP_INFO, META_TAGS } from './meta'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    preview: {
      port: 3000,
      strictPort: true,
    },
    server: {
      port: process.env.HISTOIRE ? 6006 : 3000,
      strictPort: true,
    },
    base: process.env.HISTOIRE_BASE || '/',
    histoire: {
      plugins: [HstVue()],
      setupFile: '/src/histoire.setup.ts',
      theme: {
        title: 'The factory',
        logo: {
          light: './src/shared/ui/assets/logo.png',
          dark: './src/shared/ui/assets/logo.png',
          square: './src/shared/ui/assets/logo.png',
        },
        logoHref: 'https://thefactory-frontend-task.vercel.app/',
        favicon: 'favicon.ico',
        defaultColorScheme: 'light',
      },
      viteIgnorePlugins: ['vite-plugin-pwa:dev-sw', 'vite-plugin-pwa:build', 'vite-plugin-pwa:info', 'vite-plugin-pwa', 'vite:html'],
    },
    test: {
      environment: 'happy-dom',
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      alias: {
        '@tf-app': path.resolve(__dirname, './src'),
      },
      include: ['tests/unit/**/*.spec.ts'],
    },
    plugins: [
      vue(),
      webfontDownload(),
      createHtmlPlugin({
        minify: true,
        entry: '/src/app/main.ts',
        inject: {
          data: {
            title: APP_INFO.name,
            meta: META_TAGS.map(tag => `<meta name="${tag.name}" content="${tag.content}" />`).join(''),
          },
        },
      }),
      VitePWA({
        useCredentials: true,
        mode: mode as 'production' | 'development',
        base: '/',
        manifest: {
          name: APP_INFO.name,
          short_name: APP_INFO.name,
          description: APP_INFO.shortDescription,
          start_url: '/?source=pwa',
          id: '/?source=pwa',
          background_color: APP_INFO.app.background,
          theme_color: APP_INFO.app.background,
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        includeAssets: ['img/*.png', 'img/*.jpg'],
        registerType: 'prompt',
        workbox: {
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 4194304,
          navigateFallbackDenylist: [
            /robots.txt/,
          ],
        },
        devOptions: {
          enabled: mode === 'development',
          type: 'module',
          navigateFallback: 'index.html',
          suppressWarnings: true,
        },
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          'tf-icons': FileSystemIconLoader('./src/shared/ui/assets/icons'),
        },
      }),
    ],
    resolve: {
      alias: {
        '@tf-app': path.resolve(__dirname, './src'),
      },
    },

    build: {
      target: 'es2021',
      minify: true,
      assetsDir: 'app',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            ethers: ['mitt', 'nprogress', 'focus-trap'],
            router: ['vue-router'],
            pinia: ['pinia'],
            vue: ['vue'],
            vueuse: ['@vueuse/core', '@vueuse/router'],
          },
        },
      },
    },
  }
},
)
