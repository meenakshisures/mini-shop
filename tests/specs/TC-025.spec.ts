import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('TC-025: Verify Case-insensitive search and clear', async ({ page }) => {
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await productsPage.waitForProducts()
  await productsPage.search('MUG')

  await expect(productsPage.productNames).toHaveText(['Ceramic Mug'])

  await productsPage.search('')
  await expect(productsPage.productCards).toHaveCount(8)
})
