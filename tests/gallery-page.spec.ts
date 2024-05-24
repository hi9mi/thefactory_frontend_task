import fs from 'node:fs'
import path from 'node:path'

import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

test.describe('Gallery Page', () => {
  const fixturesPath = path.join(import.meta.dirname, '/fixtures')
  const randomPhotos = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'random-photos.json'), 'utf8')
  const searchPhotosNature = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'search-photos-nature.json'), 'utf8')

  test.describe('Successful loading random photos', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/photos/random**', async (route) => {
        await route.fulfill({
          status: 200,
          body: randomPhotos,
          contentType: 'application/json',
        })
      })

      await page.route('https://api.unsplash.com/search/photos**', async (route) => {
        await route.fulfill({
          status: 200,
          body: searchPhotosNature,
          contentType: 'application/json',
        })
      })

      await page.goto('/')
    })

    test('should display random photos or loading skeleton', async ({ page }) => {
      const photoCards = page.getByTestId('photo-card')
      const photoSkeletons = page.getByTestId('photo-skeleton')
      const isLoading = await photoSkeletons.first().isVisible()

      if (isLoading)
        await expect(photoSkeletons.first()).toBeVisible()
      else
        await expect(photoCards.first()).toBeVisible()
    })

    test('should navigate to search results page on search form submit', async ({ page }) => {
      const searchForm = page.getByTestId('search-photos-form')
      const searchInput = searchForm.getByPlaceholder('Поиск')
      const photoCards = page.getByTestId('photo-card')
      const photoSkeletons = page.getByTestId('photo-skeleton')

      await searchInput.fill('nature')
      await searchForm.press('Enter')

      await page.waitForURL('/search?q=nature&p=1')
      await expect(photoSkeletons).toHaveCount(9)
      expect(page.url()).toContain('/search?q=nature&p=1')
      await expect(searchInput).toHaveValue('nature')
      await expect(photoCards).toHaveCount(9)
    })

    test('should show affix when we scroll and hide when we\'re at the top', async ({ page }) => {
      const affixElement = page.getByTestId('affix')

      await page.evaluate(() => {
        window.scrollTo(0, 500)
      })

      await expect(affixElement).toBeVisible()

      await affixElement.click()

      await expect(affixElement).not.toBeVisible()
    })

    test('should show favorite and download buttons on hover', async ({ page }) => {
      const photoCard = page.getByTestId('photo-card').first()

      await photoCard.hover()

      const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
      const downloadButton = page.getByTestId('download-photo-btn').first()

      await expect(favoriteButton).toBeVisible()
      await expect(downloadButton).toBeVisible()
    })

    test('should add photo to favorites on click', async ({ page }) => {
      const photoCard = page.getByTestId('photo-card').first()
      checkNumberOfPhotosInLocalStorage(page, 0)
      await photoCard.hover()

      const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
      await favoriteButton.click()
      const notification = page.getByText('Фото добавлено в избранное')

      await expect(notification).toBeVisible()
      checkNumberOfPhotosInLocalStorage(page, 1)
    })

    test('should remove photo from favorites on click', async ({ page }) => {
      const photoCard = page.getByTestId('photo-card').first()

      checkNumberOfPhotosInLocalStorage(page, 0)
      await photoCard.hover()
      const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
      await favoriteButton.click()
      let notification = page.getByText('Фото добавлено в избранное')

      await expect(notification).toBeVisible()
      checkNumberOfPhotosInLocalStorage(page, 1)

      await favoriteButton.click()
      notification = page.getByText('Фото удалено из избранного')

      await expect(notification).toBeVisible()
      checkNumberOfPhotosInLocalStorage(page, 0)
    })

    test('should download photo on click', async ({ page }) => {
      await page.route('**/*', route => route.continue())
      const photoCard = page.getByTestId('photo-card').first()

      await photoCard.hover()
      const downloadButton = page.getByTestId('download-photo-btn').first()
      await downloadButton.click()

      const notification = page.getByText('Не удалось начать загрузку фотографии')
      await expect(notification).not.toBeVisible()
    })

    test('should redirect to photo page on click', async ({ page }) => {
      const photoCards = page.getByTestId('photo-card')

      await photoCards.first().click()
      await page.waitForURL('/Cleue5NMLuY')
      await expect(page).toHaveURL('/Cleue5NMLuY')
    })
  })

  test.describe('Failed loading random photos', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://api.unsplash.com/photos/random**', async (route) => {
        await route.fulfill({
          status: 403,
          body: 'Rate Limit Exceeded',
          contentType: 'application/json',
        })
      })

      await page.goto('/')
    })

    test('should notify on error when fetching random photos', async ({ page }) => {
      const photoSkeletons = page.getByTestId('photo-skeleton')
      const isLoading = await photoSkeletons.first().isVisible()

      if (isLoading)
        await expect(photoSkeletons.first()).toBeVisible()
      else
        await expect(page.getByText('Ошибка при загрузке фотографий')).toBeVisible()
    })
  })
})

async function checkNumberOfPhotosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage.favorites).length === e
  }, expected)
}
