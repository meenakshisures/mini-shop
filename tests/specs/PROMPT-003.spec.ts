import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('PROMPT-003: Searching for mug shows only the Ceramic Mug', async ({ page }) => {
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await productsPage.waitForProducts()
  await productsPage.search('mug')

  await expect(productsPage.productCards).toHaveCount(1)
  await expect(productsPage.productNames).toHaveText(['Ceramic Mug'])
})
