import { expect, test } from '@playwright/test'
import { CartPage } from '../pages/CartPage'

test('PROMPT-005: Empty cart shows message and checkout is disabled', async ({ page }) => {
  const cartPage = new CartPage(page)

  await cartPage.open()

  await expect(cartPage.emptyMessage).toHaveText('Your cart is empty.')
  await expect(cartPage.checkoutButton).toBeDisabled()
})
