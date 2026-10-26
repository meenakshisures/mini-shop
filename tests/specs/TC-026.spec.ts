import { expect, test } from '@playwright/test'
import { HeaderComponent } from '../pages/HeaderComponent'
import { ProductsPage } from '../pages/ProductsPage'

test('TC-026: Search item, add to cart, and clear search', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const header = new HeaderComponent(page)

  await productsPage.open()
  await productsPage.waitForProducts()
  await productsPage.search('Desk')

  await expect(productsPage.productNames).toHaveText(['Desk Lamp'])
  await productsPage.addToCartButton('desk-lamp').click()
  await expect(header.cartBadge).toHaveText('1')

  await productsPage.search('')
  await expect(productsPage.productCards).toHaveCount(8)
  await expect(header.cartBadge).toHaveText('1')
})
