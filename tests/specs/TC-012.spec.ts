import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('TC-012: Sort by price high to low', async ({ page }) => {
  // Known app bug: the expected result below is the CORRECT behaviour, so this test is expected to fail.
  test.info().annotations.push({ type: 'known-bug', description: 'Sort "Price high-low" places the most expensive item last instead of first' })
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await productsPage.waitForProducts()
  await productsPage.sortBy('Price high-low')

  await expect(productsPage.productNames.first()).toHaveText('Wireless Headphones')
  await expect(productsPage.productNames.last()).toHaveText('Notebook Set')
})
