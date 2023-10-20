/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/vue" />

interface ImportMetaEnv {
  readonly VITE_UNSPLASH_API_URL: string
  readonly VITE_UNSPLASH_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
