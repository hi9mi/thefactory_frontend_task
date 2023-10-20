import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import HtmlConfig from 'vite-plugin-html-config'
import { VitePWA } from 'vite-plugin-pwa'
import webfontDownload from 'vite-plugin-webfont-dl'

import { APP_INFO, META_TAGS } from './meta'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const pwaMode = mode === 'production' ? 'production' : 'development'

  return {
    plugins: [
      vue({ script: { defineModel: true } }),
      webfontDownload(),
      HtmlConfig({
        metas: META_TAGS,
      }),
      VitePWA({
        mode: pwaMode,
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
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'img/logo.png', 'img/bg.jpg', 'img/bg-mobile.jpg'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 4194304,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'api-photos-cache',
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/api\.unsplash\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'api-cache',
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
          navigateFallbackDenylist: [
            /robots.txt/,
          ],
        },
        devOptions: {
          enabled: pwaMode === 'development',
          type: 'module',
          navigateFallback: 'index.html',
          suppressWarnings: true,
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

      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash].[ext]',

          manualChunks(chunkPath: string) {
            if (chunkPath.includes('node_modules/'))
              return 'vendors'
          },
        },
      },
    },
  }
},
)
