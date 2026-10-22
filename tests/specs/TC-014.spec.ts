import { expect, test } from '@playwright/test'
import { ProductDetailPage } from '../pages/ProductDetailPage'
import { HeaderComponent } from '../pages/HeaderComponent'
import { CartPage } from '../pages/CartPage'

test('TC-014: Add product with quantity 3 from the detail page', async ({ page }) => {
  const detailPage = new ProductDetailPage(page)
  const header = new HeaderComponent(page)
  const cartPage = new CartPage(page)

  await detailPage.open('wireless-headphones')
  await detailPage.addToCart(3)
  await expect(detailPage.addedMessage).toHaveText('Added to cart.')

  await header.cartLink.click()
  await expect(cartPage.row('wireless-headphones')).toContainText('Wireless Headphones')
  await expect(cartPage.quantity('wireless-headphones')).toHaveText('3')
  await expect(cartPage.subtotal('wireless-headphones')).toHaveText('$239.97')
})
