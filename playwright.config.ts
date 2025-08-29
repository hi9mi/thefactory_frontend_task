import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const CI = !!process.env.CI && process.env.CI !== '0'

const BASE_URL = process.env.PW_BASE_URL ?? 'http://localhost:3000'
const { hostname, port } = new URL(BASE_URL)
const PREVIEW_HOST = hostname || 'localhost'
const PREVIEW_PORT = port || '3000'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 4 : undefined,
  reporter: [['html', { open: 'never' }]],
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    headless: true,
    trace: CI ? 'on-first-retry' : 'retain-on-failure',
    video: 'on-first-retry',
    launchOptions: { args: CI ? ['--disable-dev-shm-usage'] : [] },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: `npm run build && npm run preview -- --host ${PREVIEW_HOST} --port ${PREVIEW_PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
})
