import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { CheckoutPage } from '../pages/CheckoutPage'

test('TC-017: Checkout shows validation errors for empty form', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const checkoutPage = new CheckoutPage(page)

  await productsPage.addItemsToCart('ceramic-mug')
  await page.goto('/checkout')
  await checkoutPage.placeOrderButton.click()

  await expect(checkoutPage.fullNameError).toHaveText('Full name is required.')
  await expect(checkoutPage.emailError).toHaveText('Email is required.')
  await expect(checkoutPage.addressError).toHaveText('Address is required.')
  await expect(checkoutPage.termsError).toHaveText('You must accept the terms.')
})
