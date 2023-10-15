import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import webfontDownload from 'vite-plugin-webfont-dl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ script: { defineModel: true } }), webfontDownload()],
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
})
