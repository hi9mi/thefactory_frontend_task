import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import { checkNumberOfItemsInLocalStorage } from './libs/storage'

test.describe('Gallery Page', () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const fixturesPath = path.join(__dirname, 'fixtures')

  const randomPhotosStr = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'random-photos.json'), 'utf8')
  const searchPhotosNatureStr = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'search-photos-nature.json'), 'utf8')

  const randomPhotos = JSON.parse(randomPhotosStr) as Array<{ id: string }>
  const EXPECTED_RANDOM_COUNT = randomPhotos.length
  const KEY = 'favorites:v1'

  test.describe('Successful loading random photos', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/photos/random**', route =>
        route.fulfill({ status: 200, body: randomPhotosStr, contentType: 'application/json' }))
      await page.route('https://api.unsplash.com/search/photos**', route =>
        route.fulfill({ status: 200, body: searchPhotosNatureStr, contentType: 'application/json' }))

      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.getByTestId('photo-card').first().waitFor()
    })

    test('shows random photos', async ({ page }) => {
      const photoCards = page.getByTestId('photo-card')
      const photoSkeletons = page.getByTestId('photo-skeleton')

      await expect(photoCards).toHaveCount(EXPECTED_RANDOM_COUNT)
      await expect(photoSkeletons).toHaveCount(0)
    })

    test('navigates to search results on submit', async ({ page }) => {
      const searchForm = page.getByTestId('search-photos-form')
      const searchInput = searchForm.getByPlaceholder('Search')

      await searchInput.fill('nature')
      await searchInput.press('Enter')

      await expect(page).toHaveURL(/\/search\?q=nature&page=1$/)
      await expect(searchInput).toHaveValue('nature')
    })

    test('shows affix on scroll and hides after click', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 500))
      const affixElement = page.getByTestId('affix')
      await expect(affixElement).toBeVisible()
      await affixElement.click()
      await expect(affixElement).not.toBeVisible()
    })

    test('shows favorite and download buttons on hover (desktop only)', async ({ page, isMobile }) => {
      if (isMobile)
        test.skip()

      const card = page.getByTestId('photo-card').first()

      await card.scrollIntoViewIfNeeded()
      await card.hover()

      const overlay = card.getByTestId('photo-actions-overlay')
      const favoriteButton = card.getByTestId('toggle-favorite-photo-btn')
      const downloadButton = card.getByTestId('download-photo-btn')

      await expect(overlay).toBeVisible({ timeout: 3000 })
      await expect(favoriteButton).toBeVisible()
      await expect(downloadButton).toBeVisible()
    })

    test('adds photo to favorites on click (desktop only)', async ({ page, isMobile }) => {
      if (isMobile)
        test.skip()

      const photoCard = page.getByTestId('photo-card').first()

      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })
      await photoCard.scrollIntoViewIfNeeded()
      await photoCard.hover()

      const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
      await favoriteButton.click()

      const notification = page.getByText('Photo added to favorites')
      await expect(notification).toBeVisible()
      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 1, defaultValue: '[]' })
    })

    test('removes photo from favorites on click (desktop only)', async ({ page, isMobile }) => {
      if (isMobile)
        test.skip()

      const photoCard = page.getByTestId('photo-card').first()
      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })

      await photoCard.scrollIntoViewIfNeeded()
      await photoCard.hover()
      const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()

      await favoriteButton.click()
      await expect(page.getByText('Photo added to favorites')).toBeVisible()
      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 1, defaultValue: '[]' })

      await favoriteButton.click()
      await expect(page.getByText('Photo removed from favorites')).toBeVisible()
      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })
    })

    test('downloads photo on click (desktop only)', async ({ page, isMobile }) => {
      if (isMobile)
        test.skip()

      await page.route('**/*', route => route.continue())

      const photoCard = page.getByTestId('photo-card').first()
      await photoCard.scrollIntoViewIfNeeded()
      await photoCard.hover()

      const downloadButton = page.getByTestId('download-photo-btn').first()
      await downloadButton.click()

      const notification = page.getByText('Error while downloading photo')
      await expect(notification).toBeHidden()
    })

    test('redirects to photo page on card click', async ({ page }) => {
      const firstId = randomPhotos[0].id
      await page.getByTestId('photo-card').first().click()
      await expect(page).toHaveURL(new RegExp(`/${firstId}$`))
    })
  })
})

test.describe('Failed loading random photos', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://api.unsplash.com/photos/random**', route =>
      route.fulfill({ status: 403, body: 'Rate Limit Exceeded', contentType: 'application/json' }))
    await page.goto('/', { waitUntil: 'domcontentloaded' })
  })

  test('notifies on error when fetching random photos', async ({ page }) => {
    await expect(page.getByText('Failed load photos')).toBeVisible()
  })
})
