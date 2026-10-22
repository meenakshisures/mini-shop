import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { OrderSuccessPage } from '../pages/OrderSuccessPage'

test('TC-019: Place an order with standard shipping', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const checkoutPage = new CheckoutPage(page)
  const successPage = new OrderSuccessPage(page)

  await productsPage.addItemsToCart('ceramic-mug')
  await page.goto('/checkout')
  await checkoutPage.fillDetails('Jane Doe', 'jane.doe@example.com', '12 Main Street')
  await checkoutPage.standardShipping.check()
  await checkoutPage.termsCheckbox.check()
  await checkoutPage.placeOrderButton.click()
  await checkoutPage.confirmButton.click()

  await expect(checkoutPage.confirmButton).toHaveText('Placing order...')
  await expect(page).toHaveURL(/\/order-success$/, { timeout: 10_000 })
  await expect(successPage.heading).toHaveText('Thank you for your order!')
  await expect(successPage.orderNumber).toHaveText('ORD-0001')
  await expect(successPage.orderTotal).toHaveText('$14.99')
})
