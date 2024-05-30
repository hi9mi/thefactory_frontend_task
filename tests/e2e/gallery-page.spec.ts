import fs from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { checkNumberOfItemsInLocalStorage } from './libs/storage'

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

    test('should show random photos', async ({ page }) => {
      const photoCards = page.getByTestId('photo-card')
      const photoSkeletons = page.getByTestId('photo-skeleton')

      await expect(photoSkeletons).toHaveCount(0)
      await expect(photoCards).toHaveCount(9)
    })

    test('should navigate to search results page on search form submit', async ({ page }) => {
      const searchForm = page.getByTestId('search-photos-form')
      const searchInput = searchForm.getByPlaceholder('Поиск')

      await searchInput.fill('nature')
      await searchForm.getByRole('search').press('Enter')

      await expect(page).toHaveURL('/search?q=nature&p=1')

      await expect(searchInput).toHaveValue('nature')
    })

    test('should show affix when we scroll and hide when we\'re at the top', async ({ page }) => {
      await page.evaluate(() => {
        window.scrollTo(0, 500)
      })

      const affixElement = page.getByTestId('affix')

      await expect(affixElement).toBeVisible()
      await affixElement.click()
      await expect(affixElement).not.toBeVisible()
    })

    test('should show favorite and download buttons on hover', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip()
      }
      else {
        const photoCard = page.getByTestId('photo-card').first()

        await photoCard.hover()

        const favoriteButton = page.getByTestId('toggle-favorite-photo-btn')
        const downloadButton = page.getByTestId('download-photo-btn')

        await page.waitForSelector('[data-testid="photo-actions-overlay"]', { state: 'visible' })
        await expect(favoriteButton).toBeVisible()
        await expect(downloadButton).toBeVisible()
      }
    })

    test('should add photo to favorites on click', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip()
      }
      else {
        const photoCard = page.getByTestId('photo-card').first()

        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0, defaultValue: '[]' })
        await photoCard.hover()

        const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
        await favoriteButton.click()

        const notification = page.getByText('Фото добавлено в избранное')
        await expect(notification).toBeVisible()
        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 1, defaultValue: '[]' })
      }
    })

    test('should remove photo from favorites on click', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip()
      }
      else {
        const photoCard = page.getByTestId('photo-card').first()

        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0, defaultValue: '[]' })

        await photoCard.hover()
        const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()

        await favoriteButton.click()

        let notification = page.getByText('Фото добавлено в избранное')
        await expect(notification).toBeVisible()
        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 1, defaultValue: '[]' })

        await favoriteButton.click()

        notification = page.getByText('Фото удалено из избранного')
        await expect(notification).toBeVisible()
        await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 0, defaultValue: '[]' })
      }
    })

    test('should download photo on click', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip()
      }
      else {
        await page.route('**/*', route => route.continue())
        const photoCard = page.getByTestId('photo-card').first()

        await photoCard.hover()
        const downloadButton = page.getByTestId('download-photo-btn').first()

        await downloadButton.click()

        const notification = page.getByText('Не удалось начать загрузку фотографии')
        await expect(notification).not.toBeVisible()
      }
    })

    test('should redirect to photo page on click', async ({ page }) => {
      const photoCards = page.getByTestId('photo-card')

      await photoCards.first().click()
      await expect(page).toHaveURL('/Cleue5NMLuY')
    })
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

    await expect(photoSkeletons).toHaveCount(0)
    await expect(page.getByText('Ошибка при загрузке фотографий')).toBeVisible()
  })
})
