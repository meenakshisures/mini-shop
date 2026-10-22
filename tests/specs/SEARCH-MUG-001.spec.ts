import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('Searching for mug shows only the Ceramic Mug', async ({ page }) => {
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await productsPage.search('mug')

  await expect(productsPage.productNames).toHaveText(['Ceramic Mug'])
})
