import { expect, test } from '@playwright/test'
import { CartPage } from '../pages/CartPage'

test('TC-015: Empty cart shows message and disables checkout', async ({ page }) => {
  const cartPage = new CartPage(page)

  await cartPage.open()

  await expect(cartPage.emptyMessage).toHaveText('Your cart is empty.')
  await expect(cartPage.checkoutButton).toBeDisabled()
})
