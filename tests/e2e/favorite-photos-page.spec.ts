import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import { checkNumberOfItemsInLocalStorage, simulateLocalStorageEvent } from './libs/storage'

test.describe('Favorites Photos Page', () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const fixturesPath = path.join(__dirname, 'fixtures')

  const randomPhotosStr = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'random-photos.json'), 'utf8')
  const newValueStr = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'storage-new-value.json'), 'utf8')

  const randomPhotos = JSON.parse(randomPhotosStr) as Array<{ id: string }>
  const newValue = JSON.parse(newValueStr) as Array<{ id: string }>
  const a = randomPhotos.concat(newValue)
  const LS_KEY = 'favorites:v1'
  const BATCH = 30

  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(({ key, value }) => {
      window.localStorage.setItem(key, value)
    }, { key: LS_KEY, value: randomPhotosStr })

    await page.goto('/favorites', { waitUntil: 'domcontentloaded' })
    await page.getByTestId('photo-card').first().waitFor()
  })

  test('shows favorite photos', async ({ page }) => {
    const photoCards = page.getByTestId('photo-card')
    const pagination = page.getByTestId('pagination')
    const page1 = pagination.getByText('1')
    const page2 = pagination.getByText('2')

    await checkNumberOfItemsInLocalStorage({ key: LS_KEY, page, expected: randomPhotos.length })
    await expect(photoCards).toHaveCount(randomPhotos.length)
    await expect(page1).toBeVisible()
    await expect(page2).not.toBeVisible()
  })

  test('paginates correctly after storage change', async ({ page }) => {
    const photoCards = page.getByTestId('photo-card')
    const pagination = page.getByTestId('pagination')
    const page1 = pagination.getByText('1')
    const page2 = pagination.getByText('2')

    await expect(page1).toBeVisible()
    await expect(page2).not.toBeVisible()

    await simulateLocalStorageEvent({
      page,
      key: LS_KEY,
      oldValue: randomPhotosStr,
      newValue: JSON.stringify(a),
    })

    await expect(page1).toBeVisible()
    await expect(page2).toBeVisible()

    await page2.click()
    await expect(page).toHaveURL(/\/favorites\?page=2$/)

    const expectedTailCount = Math.max(a.length - BATCH, 0)
    await expect(photoCards).toHaveCount(expectedTailCount)
  })

  test('redirects to photo details on card click', async ({ page }) => {
    const firstId = randomPhotos[0].id
    await page.getByTestId('photo-card').first().click()
    await expect(page).toHaveURL(new RegExp(`/${firstId}$`))
  })

  test('shows favorite and download buttons on hover (desktop only)', async ({ page, isMobile }) => {
    if (isMobile)
      test.skip()

    const photoCard = page.getByTestId('photo-card').first()
    await photoCard.scrollIntoViewIfNeeded()
    await photoCard.hover()

    const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
    const downloadButton = page.getByTestId('download-photo-btn').first()

    await expect(favoriteButton).toBeVisible()
    await expect(downloadButton).toBeVisible()
  })

  test('removes photo from favorites on click (desktop only)', async ({ page, isMobile }) => {
    if (isMobile)
      test.skip()

    await checkNumberOfItemsInLocalStorage({ key: LS_KEY, page, expected: randomPhotos.length })

    const photoCard = page.getByTestId('photo-card').first()
    await photoCard.scrollIntoViewIfNeeded()
    await photoCard.hover()

    const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
    await favoriteButton.click()

    const notification = page.getByText('Photo removed from favorites')
    await expect(notification).toBeVisible()
    await checkNumberOfItemsInLocalStorage({ key: LS_KEY, page, expected: randomPhotos.length - 1 })
  })

  test('downloads photo on click (desktop only)', async ({ page, isMobile }) => {
    if (isMobile)
      test.skip()

    await page.route('**/*', r => r.continue())

    const photoCard = page.getByTestId('photo-card').first()
    await photoCard.scrollIntoViewIfNeeded()
    await photoCard.hover()

    const downloadButton = page.getByTestId('download-photo-btn').first()
    await downloadButton.click()

    const notification = page.getByText('Error while downloading photo')
    await expect(notification).toBeHidden()
  })

  test('shows affix on scroll and hides after click', async ({ page }) => {
    await page.getByTestId('photo-card').first().waitFor()
    await page.evaluate(() => window.scrollTo(0, 500))
    const affixElement = page.getByTestId('affix')

    await expect(affixElement).toBeVisible()
    await affixElement.click()
    await expect(affixElement).not.toBeVisible()
  })

  test('shows empty state when no favorites', async ({ page }) => {
    await simulateLocalStorageEvent({
      page,
      key: LS_KEY,
      oldValue: randomPhotosStr,
      newValue: '[]',
    })

    await expect(page.getByTestId('favorites-empty')).toBeVisible()
    await expect(page.getByTestId('pagination')).toBeHidden()
  })
})
