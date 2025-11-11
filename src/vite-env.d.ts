/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/vue" />
/// <reference types="@histoire/plugin-vue/components" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  readonly VITE_UNSPLASH_API_URL: string
  readonly VITE_UNSPLASH_CLIENT_ID: string
  readonly VITE_STORAGE_KIND: 'memoryStorage' | 'localStorage' | 'sessionStorage'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
