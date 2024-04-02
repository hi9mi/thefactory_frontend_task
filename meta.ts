import type { IHTMLTag } from 'vite-plugin-html-config'

export const APP_INFO = {
  name: 'The Factory Gallery',
  shortDescription: 'Easily search amazing photos',
  description:
    'With The Factory Photo Gallery, you can easily search for amazing photos and add them to your favorites.',
  keywords:
    'the factory, photo gallery, photos, photo collections, the factory chrome, the factory online, the factory for mac, the factory app, the factory for windows, the factory google chrome, the factory chrome app, get the factory, the factory web, the factory android, the factory app for chrome, the factory mobile app, the factory web app',
  app: {
    background: '#242424',
    lightThemeColor: '#ffffff',
    darkThemeColor: '#242424',
    primaryColor: '#fff200',
  },
} as const

export const META_TAGS: IHTMLTag[] = [
  {
    name: 'keywords',
    content: APP_INFO.keywords,
  },
  {
    name: 'X-UA-Compatible',
    content: 'IE=edge, chrome=1',
  },
  {
    name: 'name',
    content: `${APP_INFO.name} • ${APP_INFO.shortDescription}`,
  },
  {
    name: 'description',
    content: APP_INFO.description,
  },
  {
    name: 'image',
    content: '/banner.png',
  },
  // Open Graph tags
  {
    name: 'og:title',
    content: `${APP_INFO.name} • ${APP_INFO.shortDescription}`,
  },
  {
    name: 'og:description',
    content: APP_INFO.description,
  },
  {
    name: 'og:image',
    content: '/banner.png',
  },
  // Twitter tags
  {
    name: 'twitter:card',
    content: 'summary_large_image',
  },
  {
    name: 'twitter:title',
    content: `${APP_INFO.name} • ${APP_INFO.shortDescription}`,
  },
  {
    name: 'twitter:description',
    content: APP_INFO.description,
  },
  {
    name: 'twitter:image',
    content: '/banner.png',
  },
  // Add to homescreen for Chrome on Android. Fallback for PWA (handled by nuxt)
  {
    name: 'application-name',
    content: APP_INFO.name,
  },
  // Windows phone tile icon
  {
    name: 'msapplication-TileImage',
    content: '/favicon-32x32.png',
  },
  {
    name: 'msapplication-TileColor',
    content: APP_INFO.app.primaryColor,
  },
  {
    name: 'msapplication-tap-highlight',
    content: 'no',
  },
  // iOS Safari
  {
    name: 'apple-mobile-web-app-title',
    content: APP_INFO.name,
  },
  {
    name: 'apple-mobile-web-app-capable',
    content: 'yes',
  },
  {
    name: 'apple-mobile-web-app-status-bar-style',
    content: 'black-translucent',
  },
  // PWA
  {
    name: 'theme-color',
    content: APP_INFO.app.primaryColor,
  },
  {
    name: 'color-scheme',
    content: 'light dark',
  },
  {
    name: 'supported-color-schemes',
    content: 'light dark',
  },
  {
    name: 'mask-icon',
    content: '/maskable_icon.png',
    color: APP_INFO.app.primaryColor,
  },
]
