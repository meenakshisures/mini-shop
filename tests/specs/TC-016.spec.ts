import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { HeaderComponent } from '../pages/HeaderComponent'
import { CartPage } from '../pages/CartPage'

test('TC-016: Removing an item updates the cart total', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const header = new HeaderComponent(page)
  const cartPage = new CartPage(page)

  await productsPage.addItemsToCart('ceramic-mug', 'desk-lamp')
  await header.cartLink.click()
  await cartPage.removeButton('ceramic-mug').click()

  await expect(cartPage.row('ceramic-mug')).toHaveCount(0)
  await expect(cartPage.row('desk-lamp')).toBeVisible()
  await expect(cartPage.total).toHaveText('$39.99')
})
