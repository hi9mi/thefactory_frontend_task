import fs from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { checkNumberOfItemsInLocalStorage } from './libs/storage'

test.describe('Details Photo Page', () => {
  const fixturesPath = path.join(import.meta.dirname, '/fixtures')
  const photo = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'photo.json'), 'utf8')

  test.beforeEach(async ({ page }) => {
    await page.route('https://api.unsplash.com/photos/**', async (route) => {
      setTimeout(async () => {
        await route.fulfill({
          status: 200,
          body: photo,
          contentType: 'application/json',
        })
      }, 1000)
    })

    await page.goto('/wQRPdaExlS4', { waitUntil: 'networkidle' })
  })

  test('should displays loader initially', async ({ page }) => {
    await page.waitForSelector('[data-testid="loader"]', { state: 'visible' })
    await expect(page.getByTestId('loader')).toBeVisible()
  })

  test('should loads and displays photo details', async ({ page }) => {
    const userName = await page.locator('[data-testid="user-name"]').textContent()
    const userNickname = await page.locator('[data-testid="user-nickname"]').textContent()

    expect(userName?.trim()).toBe('Joey Chacon')
    expect(userNickname?.trim()).toBe('@joey_noside')

    await expect(page.getByTestId('toggle-favorite-photo-btn')).toBeVisible()
    await expect(page.getByTestId('download-photo-btn')).toBeVisible()
    await expect(page.getByTestId('preview-btn')).toBeVisible()
  })

  test('should handles full photo view', async ({ page }) => {
    await page.waitForSelector('[data-testid="preview-btn"]')
    await page.click('[data-testid="preview-btn"]')

    await page.waitForSelector('[data-testid="full-photo"]', { state: 'visible' })
    await expect(page.getByTestId('full-photo')).toBeVisible()
    await expect(page).toHaveURL('/wQRPdaExlS4/full')
  })

  test('should handles back to details view', async ({ page }) => {
    await page.waitForSelector('[data-testid="preview-btn"]')
    await page.click('[data-testid="preview-btn"]')

    await page.waitForSelector('[data-testid="full-photo"]', { state: 'visible' })
    await expect(page.getByTestId('full-photo')).toBeVisible()
    await expect(page).toHaveURL('/wQRPdaExlS4/full')

    await page.click('[data-testid="close-preview-btn"]')

    await expect(page.getByTestId('full-photo')).not.toBeVisible()
    await expect(page).toHaveURL('/wQRPdaExlS4')
  })

  test('should add photo to favorites on click', async ({ page }) => {
    await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0 })

    await page.click('[data-testid="toggle-favorite-photo-btn"]')

    await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 1 })
  })

  test('should remove photo from favorites on click', async ({ page }) => {
    await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0 })

    await page.click('[data-testid="toggle-favorite-photo-btn"]')

    await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 1 })

    await page.click('[data-testid="toggle-favorite-photo-btn"]')

    await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0 })
  })

  test('should download photo on click', async ({ page }) => {
    await page.route('**/*', route => route.continue())

    await page.click('[data-testid="download-photo-btn"]')

    const notification = page.getByText('Не удалось начать загрузку фотографии')
    await expect(notification).not.toBeVisible()
  })
})
