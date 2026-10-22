import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('TC-010: Search with no match shows empty message', async ({ page }) => {
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await productsPage.waitForProducts()
  await productsPage.search('zzz')

  await expect(productsPage.noResultsMessage).toHaveText('No products found.')
  await expect(productsPage.productCards).toHaveCount(0)
})
