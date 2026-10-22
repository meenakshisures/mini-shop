import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { CheckoutPage } from '../pages/CheckoutPage'

test('TC-018: Checkout rejects an invalid email', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const checkoutPage = new CheckoutPage(page)

  await productsPage.addItemsToCart('ceramic-mug')
  await page.goto('/checkout')
  await checkoutPage.fillDetails('Jane Doe', 'jane.doe@', '12 Main Street')
  await checkoutPage.termsCheckbox.check()
  await checkoutPage.placeOrderButton.click()

  await expect(checkoutPage.emailError).toHaveText('Enter a valid email address.')
  await expect(checkoutPage.confirmModal).toBeHidden()
})
