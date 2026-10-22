import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('TC-011: Sort by price low to high', async ({ page }) => {
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await productsPage.waitForProducts()
  await productsPage.sortBy('Price low-high')

  await expect(productsPage.productNames.first()).toHaveText('Notebook Set')
  await expect(productsPage.productCard('notebook-set')).toContainText('$12.99')
  await expect(productsPage.productNames.last()).toHaveText('Wireless Headphones')
  await expect(productsPage.productCard('wireless-headphones')).toContainText('$79.99')
})
