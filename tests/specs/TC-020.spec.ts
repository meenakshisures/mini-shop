import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { CheckoutPage } from '../pages/CheckoutPage'

test('TC-020: Express shipping adds 10 dollars to the total', async ({ page }) => {
  // Known app bug: the expected result below is the CORRECT behaviour, so this test is expected to fail.
  test.info().annotations.push({ type: 'known-bug', description: 'Express shipping adds $1 instead of $10 in checkout' })
  const productsPage = new ProductsPage(page)
  const checkoutPage = new CheckoutPage(page)

  await productsPage.addItemsToCart('ceramic-mug')
  await page.goto('/checkout')
  await checkoutPage.expressShipping.check()

  await expect(checkoutPage.summaryTotal).toHaveText('$24.99')
})
