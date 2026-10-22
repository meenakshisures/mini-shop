import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { LoginPage } from '../pages/LoginPage'
import { CartPage } from '../pages/CartPage'

test('TC-021: Reset app data clears state and logs out', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const settingsPage = new SettingsPage(page)
  const loginPage = new LoginPage(page)
  const cartPage = new CartPage(page)

  await productsPage.addItemsToCart('ceramic-mug')
  await settingsPage.open()
  await settingsPage.resetButton.click()

  await expect(settingsPage.toast).toHaveText('App data has been reset.')
  await expect(page).toHaveURL(/\/login$/)

  await loginPage.login('standard_user', 'test123')
  await cartPage.open()
  await expect(cartPage.emptyMessage).toHaveText('Your cart is empty.')
})
