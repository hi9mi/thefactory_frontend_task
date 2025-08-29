import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import { checkNumberOfItemsInLocalStorage } from './libs/storage'

test.describe('Details Photo Page', () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const fixturesPath = path.join(__dirname, 'fixtures')
  const photo = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'photo.json'), 'utf8')
  const photoObj = JSON.parse(photo) as { id: string, [key: string]: any }
  const KEY = 'favorites:v1'

  test.beforeEach(async ({ page }) => {
    await page.route('https://api.unsplash.com/photos/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: photo,
        contentType: 'application/json',
      })
    })

    await page.goto(`/${photoObj.id}`)
    await page.getByTestId('user-name').waitFor()
  })

  test('loads and displays photo details', async ({ page }) => {
    await expect(page.getByTestId('user-name')).toHaveText('Jason Leung')
    await expect(page.getByTestId('user-nickname')).toHaveText('@ninjason')

    await expect(page.getByTestId('toggle-favorite-photo-btn')).toBeVisible()
    await expect(page.getByTestId('download-photo-btn')).toBeVisible()
    await expect(page.getByTestId('preview-btn')).toBeVisible()

    await expect(page.getByTestId('photo-bg')).toBeVisible()
  })

  test('opens full photo view', async ({ page }) => {
    await page.getByTestId('preview-btn').click()

    await expect(page.getByTestId('full-photo')).toBeVisible()
    await expect(page).toHaveURL(/\/v9NklNa26GU\/full$/)
  })

  test('closes full photo view and returns to details', async ({ page }) => {
    await page.getByTestId('preview-btn').click()
    await expect(page.getByTestId('full-photo')).toBeVisible()
    await expect(page).toHaveURL(/\/v9NklNa26GU\/full$/)

    await page.getByTestId('close-preview-btn').click()

    await expect(page.getByTestId('full-photo')).toBeHidden()
    await expect(page).toHaveURL(/\/v9NklNa26GU/)
  })

  test('adds photo to favorites', async ({ page }) => {
    await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })

    await page.getByTestId('toggle-favorite-photo-btn').click()

    await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 1 })
  })

  test('removes photo from favorites', async ({ page }) => {
    await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })

    await page.getByTestId('toggle-favorite-photo-btn').click()

    await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 1 })

    await page.getByTestId('toggle-favorite-photo-btn').click()
    await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })
  })

  test('downloads photo', async ({ page }) => {
    await page.route('**/*', route => route.continue())

    await page.getByTestId('download-photo-btn').click()

    const notification = page.getByText('Error while downloading photo')
    await expect(notification).toBeHidden()
  })
})
