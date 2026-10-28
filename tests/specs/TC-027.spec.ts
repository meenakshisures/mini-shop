import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('TC-027: Special characters search and clear', async ({ page }) => {
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await productsPage.waitForProducts()
  await productsPage.search('@#$')

  await expect(productsPage.noResultsMessage).toHaveText('No products found.')
  await expect(productsPage.productCards).toHaveCount(0)

  await productsPage.search('')
  await expect(productsPage.noResultsMessage).toBeHidden()
  await expect(productsPage.productNames).toHaveText([
    'Ceramic Mug',
    'Desk Lamp',
    'Everyday Backpack',
    'Notebook Set',
    'Travel Tumbler',
    'Water Bottle',
    'Wireless Headphones',
    'Wireless Mouse',
  ])
})
