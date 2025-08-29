import type { Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import { checkNumberOfItemsInLocalStorage } from './libs/storage'

test.describe('Search Page', () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const fixturesPath = path.join(__dirname, 'fixtures')

  const searchPhotosNatureStr = fs.readFileSync(
    path.join(fixturesPath, 'unsplash', 'search-photos-nature.json'),
    'utf8',
  )
  const searchPhotosNature = JSON.parse(searchPhotosNatureStr) as {
    results: Array<{ id: string }>
  }
  const KEY = 'favorites:v1'

  test.describe('Successful loading search photos', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/search/photos**', route =>
        route.fulfill({ status: 200, body: searchPhotosNatureStr, contentType: 'application/json' }))
      await page.goto('/search', { waitUntil: 'domcontentloaded' })
    })

    test('should display search empty text', async ({ page }) => {
      await expect(page.getByTestId('search-empty')).toBeVisible()
    })

    test('should display search results', async ({ page }) => {
      await searchByNatureTerm(page)

      const url = new URL(page.url())
      expect(url.pathname).toBe('/search')
      expect(url.searchParams.get('q')).toBe('nature')
      expect([null, '1']).toContain(url.searchParams.get('page'))

      const photoCards = page.getByTestId('photo-card')
      const photoSkeletons = page.getByTestId('photo-skeleton')

      await expect(photoCards).toHaveCount(searchPhotosNature.results.length)
      await expect(photoSkeletons).toHaveCount(0)
    })

    test('should add photo to favorites on click', async ({ page, isMobile }) => {
      if (isMobile)
        test.skip()

      await searchByNatureTerm(page)

      const card = page.getByTestId('photo-card').first()
      await card.hover()

      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })
      await card.getByTestId('toggle-favorite-photo-btn').click()

      await expect(page.getByText('Photo added to favorites')).toBeVisible()
      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 1, defaultValue: '[]' })
    })

    test('should remove photo from favorites on click', async ({ page, isMobile }) => {
      if (isMobile)
        test.skip()

      await searchByNatureTerm(page)

      const card = page.getByTestId('photo-card').first()
      await card.hover()

      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })
      const favBtn = card.getByTestId('toggle-favorite-photo-btn')

      await favBtn.click()
      await expect(page.getByText('Photo added to favorites')).toBeVisible()
      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 1, defaultValue: '[]' })

      await favBtn.click()
      await expect(page.getByText('Photo removed from favorites')).toBeVisible()
      await checkNumberOfItemsInLocalStorage({ key: KEY, page, expected: 0, defaultValue: '[]' })
    })

    test('should download photo on click', async ({ page, isMobile }) => {
      if (isMobile)
        test.skip()

      await page.route('**/*', r => r.continue())
      await searchByNatureTerm(page)

      const card = page.getByTestId('photo-card').first()
      await card.hover()

      await card.getByTestId('download-photo-btn').click()
      await expect(page.getByText('Error while downloading photo')).toBeHidden()
    })

    test('should change page on click', async ({ page }) => {
      await searchByNatureTerm(page)
      await page.getByText('2', { exact: true }).click()
      const url = new URL(page.url())
      expect(url.pathname).toBe('/search')
      expect(url.searchParams.get('q')).toBe('nature')
      expect(url.searchParams.get('page')).toBe('2')
    })

    test('should redirect to photo page on click', async ({ page }) => {
      await searchByNatureTerm(page)
      const firstId = searchPhotosNature.results[0].id
      await page.getByTestId('photo-card').first().click()
      await expect(page).toHaveURL(new RegExp(`/${firstId}$`))
    })

    test('should show affix when we scroll and hide when we\'re at the top', async ({ page }) => {
      await searchByNatureTerm(page)
      await page.evaluate(() => window.scrollTo(0, 500))
      const affix = page.getByTestId('affix')
      await expect(affix).toBeVisible()
      await affix.click()
      await expect(affix).not.toBeVisible()
    })
  })

  test.describe('Failed loading search photos', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/search/photos**', route =>
        route.fulfill({ status: 403, body: 'Rate Limit Exceeded', contentType: 'application/json' }))
      await page.goto('/search', { waitUntil: 'domcontentloaded' })
    })

    test('should notify on error when fetching search photos', async ({ page }) => {
      const form = page.getByTestId('search-photos-form')
      const input = form.getByPlaceholder('Search')
      await input.fill('nature')
      await input.press('Enter')
      await expect(page.getByText('Failed search photos')).toBeVisible()
    })
  })

  test.describe('When there are no photos by the search query', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/search/photos**', route =>
        route.fulfill({
          status: 200,
          body: '{"total":0,"total_pages":0,"results":[]}',
          contentType: 'application/json',
        }))
      await page.goto('/search', { waitUntil: 'domcontentloaded' })
    })

    test('should display no results text', async ({ page }) => {
      const form = page.getByTestId('search-photos-form')
      const input = form.getByPlaceholder('Search')
      await input.fill('nature')
      await input.press('Enter')
      await expect(page.getByTestId('no-results')).toBeVisible()
    })
  })
})

async function searchByNatureTerm(page: Page) {
  const form = page.getByTestId('search-photos-form')
  const input = form.getByPlaceholder('Search')
  await input.fill('nature')
  await input.press('Enter')
  await page.getByTestId('photo-card').first().waitFor()
}
