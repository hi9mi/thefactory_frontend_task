import fs from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { checkNumberOfItemsInLocalStorage } from './libs/storage'

test.describe('Search Page', () => {
  const fixturesPath = path.join(import.meta.dirname, '/fixtures')
  const searchPhotosNature = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'search-photos-nature.json'), 'utf8')

  test.describe('Successful loading search photos', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/search/photos**', async (route) => {
        await route.fulfill({
          status: 200,
          body: searchPhotosNature,
          contentType: 'application/json',
        })
      })

      await page.goto('/search')
    })

    test('should display search empty text', async ({ page }) => {
      const searchEmpty = page.getByTestId('search-empty')

      await expect(searchEmpty).toBeVisible()
    })

    test('should display search results', async ({ page }) => {
      const searchForm = page.getByTestId('search-photos-form')
      const searchInput = searchForm.getByPlaceholder('Поиск')
      const searchEmpty = page.getByTestId('search-empty')

      await searchInput.fill('nature')
      await searchForm.press('Enter')

      await expect(page).toHaveURL('/search?q=nature&p=1')

      const photoCards = page.getByTestId('photo-card')
      const photoSkeletons = page.getByTestId('photo-skeleton')
      const isLoading = await photoSkeletons.isVisible()

      if (isLoading)
        await expect(photoSkeletons).toHaveCount(9)
      else
        await expect(photoCards).toHaveCount(9)
      await expect(searchEmpty).not.toBeVisible()
    })

    test('should add photo to favorites on click', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip()
      }
      else {
        await page.getByTestId('search-photos-form').getByPlaceholder('Поиск').fill('nature')
        await page.getByTestId('search-photos-form').getByRole('search').press('Enter')
        await page.getByTestId('photo-card').first().hover()

        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0 })
        const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
        await favoriteButton.click()
        const notification = page.getByText('Фото добавлено в избранное')

        await expect(notification).toBeVisible()
        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 1 })
      }
    })

    test('should remove photo from favorites on click', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip()
      }
      else {
        await page.getByTestId('search-photos-form').getByPlaceholder('Поиск').fill('nature')
        await page.getByTestId('search-photos-form').getByRole('search').press('Enter')
        await page.getByTestId('photo-card').first().hover()

        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0 })
        const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
        await favoriteButton.click()
        let notification = page.getByText('Фото добавлено в избранное')
        await expect(notification).toBeVisible()
        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 1 })

        await favoriteButton.click()
        notification = page.getByText('Фото удалено из избранного')
        await expect(notification).toBeVisible()
        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0 })
      }
    })

    test('should download photo on click', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip()
      }
      else {
        await page.route('**/*', route => route.continue())
        await page.getByTestId('search-photos-form').getByPlaceholder('Поиск').fill('nature')
        await page.getByTestId('search-photos-form').getByRole('search').press('Enter')
        await page.getByTestId('photo-card').first().hover()

        const downloadButton = page.getByTestId('download-photo-btn').first()
        await downloadButton.click()

        const notification = page.getByText('Не удалось начать загрузку фотографии')
        await expect(notification).not.toBeVisible()
      }
    })

    test('should change page on click', async ({ page }) => {
      await page.getByTestId('search-photos-form').getByPlaceholder('Поиск').fill('nature')
      await page.getByTestId('search-photos-form').getByRole('search').press('Enter')

      const page2 = page.getByText('2', { exact: true })
      await page2.click()
      await await expect(page).toHaveURL('/search?q=nature&p=2')
    })

    test('should redirect to photo page on click', async ({ page }) => {
      await page.getByTestId('search-photos-form').getByPlaceholder('Поиск').fill('nature')
      await page.getByTestId('search-photos-form').getByRole('search').press('Enter')

      const photoCards = page.getByTestId('photo-card')

      await photoCards.first().click()
      await expect(page).toHaveURL('/cssvEZacHvQ')
    })
  })

  test.describe('Failed loading search photos', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/search/photos**', async (route) => {
        await route.fulfill({
          status: 403,
          body: 'Rate Limit Exceeded',
          contentType: 'application/json',
        })
      })

      await page.goto('/search')
    })

    test('should notify on error when fetching search photos', async ({ page }) => {
      await page.getByTestId('search-photos-form').getByPlaceholder('Поиск').fill('nature')
      await page.getByTestId('search-photos-form').getByRole('search').press('Enter')

      await expect(page.getByText('Ошибка при загрузке фотографий')).toBeVisible()
    })
  })

  test.describe('When there are no photos by the search query', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/search/photos**', async (route) => {
        await route.fulfill({
          status: 200,
          body: '{"total": 0,"total_pages": 0,"results": []}',
          contentType: 'application/json',
        })
      })

      await page.goto('/search')
    })

    test('should display no results text', async ({ page }) => {
      await page.getByTestId('search-photos-form').getByPlaceholder('Поиск').fill('invalid query term')
      await page.getByTestId('search-photos-form').getByRole('search').press('Enter')

      const noResults = page.getByTestId('no-results')

      await expect(noResults).toBeVisible()
    })
  })
})
