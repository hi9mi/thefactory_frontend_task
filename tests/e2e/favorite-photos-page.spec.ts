import fs from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { checkNumberOfItemsInLocalStorage, simulateLocalStorageEvent } from './libs/storage'

test.describe('Favorites Photos Page', () => {
  const fixturesPath = path.join(import.meta.dirname, '/fixtures')
  const randomPhotos = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'random-photos.json'), 'utf8')
  const newValue = fs.readFileSync(path.join(fixturesPath, 'unsplash', 'storage-new-value.json'), 'utf8')

  test.beforeEach(async ({ page }) => {
    await page.goto('/search')

    await page.evaluate((photos) => {
      localStorage.setItem('favorites', photos)
    }, randomPhotos)

    await page.goto('/favorites')
  })

  test('should show favorite photos', async ({ page }) => {
    const photoCards = page.getByTestId('photo-card')
    const pagination = page.getByTestId('pagination')
    const page1 = pagination.getByText('1')
    const page2 = pagination.getByText('2')

    await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 9 })
    await expect(photoCards).toHaveCount(9)
    await expect(page1).toBeVisible()
    await expect(page2).not.toBeVisible()
  })

  test('should paginate correctly', async ({ page }) => {
    const photoCards = page.getByTestId('photo-card')
    const pagination = page.getByTestId('pagination')
    const page1 = pagination.getByText('1')
    const page2 = pagination.getByText('2')

    await expect(page1).toBeVisible()
    await expect(page2).not.toBeVisible()

    await simulateLocalStorageEvent({ page, key: 'favorites', oldValue: randomPhotos, newValue })

    await expect(page1).toBeVisible()
    await expect(page2).toBeVisible()

    await page2.click()

    await expect(page).toHaveURL('/favorites?page=2')
    await expect(photoCards).toHaveCount(1)
  })

  test('should redirect to photo page on click', async ({ page }) => {
    const photoCards = page.getByTestId('photo-card')

    await photoCards.first().click()
    await expect(page).toHaveURL('/Cleue5NMLuY')
  })

  test('should show favorite and download buttons on hover', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip()
    }
    else {
      const photoCard = page.getByTestId('photo-card').first()
      await photoCard.hover()

      const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
      const downloadButton = page.getByTestId('download-photo-btn').first()

      await expect(favoriteButton).toBeVisible()
      await expect(downloadButton).toBeVisible()
    }
  })

  test('should remove photo from favorites on click', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip()
    }
    else {
      await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 9 })

      const photoCard = page.getByTestId('photo-card').first()
      await photoCard.hover()

      const favoriteButton = page.getByTestId('toggle-favorite-photo-btn').first()
      await favoriteButton.click()

      const notification = page.getByText('Фото удалено из избранного')
      await expect(notification).toBeVisible()
      await checkNumberOfItemsInLocalStorage({ key: 'favorites', page, expected: 8 })
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

  test('should show affix when we scroll and hide when we\'re at the top', async ({ page }) => {
    await page.evaluate(() => {
      window.scrollTo(0, 500)
    })

    const affixElement = page.getByTestId('affix')

    await expect(affixElement).toBeVisible()
    await affixElement.click()
    await expect(affixElement).not.toBeVisible()
  })
})
