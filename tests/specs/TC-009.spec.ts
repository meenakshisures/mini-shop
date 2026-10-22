import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('TC-009: Search filters the product list', async ({ page }) => {
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await productsPage.waitForProducts()
  await productsPage.search('wireless')

  await expect(productsPage.productNames).toHaveText(['Wireless Headphones', 'Wireless Mouse'])
})
