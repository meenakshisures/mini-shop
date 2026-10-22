import { expect, test } from '@playwright/test'
import { ProductDetailPage } from '../pages/ProductDetailPage'
import { HeaderComponent } from '../pages/HeaderComponent'
import { CartPage } from '../pages/CartPage'

test('PROMPT-006: Product detail quantity 2 for Wireless Mouse gives subtotal $59.98', async ({ page }) => {
  const detailPage = new ProductDetailPage(page)
  const header = new HeaderComponent(page)
  const cartPage = new CartPage(page)

  await detailPage.open('wireless-mouse')
  await detailPage.addToCart(2)
  await header.cartLink.click()

  await expect(cartPage.quantity('wireless-mouse')).toHaveText('2')
  await expect(cartPage.subtotal('wireless-mouse')).toHaveText('$59.98')
})
