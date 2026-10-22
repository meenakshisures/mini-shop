import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { HeaderComponent } from '../pages/HeaderComponent'

test('PROMPT-004: Adding the Desk Lamp increases the cart badge to 1', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const header = new HeaderComponent(page)

  await productsPage.addItemsToCart('desk-lamp')

  await expect(header.cartBadge).toHaveText('1')
})
