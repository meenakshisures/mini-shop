import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { ProductsPage } from '../pages/ProductsPage'

// Needs a logged-out user, so it skips the saved login session.
test.use({ storageState: { cookies: [], origins: [] } })

test('TC-001: Login succeeds with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const productsPage = new ProductsPage(page)

  await loginPage.open()
  await loginPage.login('standard_user', 'test123')

  await expect(page).toHaveURL(/\/products$/)
  await expect(productsPage.heading).toBeVisible()
})
