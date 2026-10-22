import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { ProductsPage } from '../pages/ProductsPage'

// Needs a logged-out user, so it skips the saved login session.
test.use({ storageState: { cookies: [], origins: [] } })

test('TC-022: UI v2 login button is renamed', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const productsPage = new ProductsPage(page)

  await loginPage.open('/login?ui=v2')
  await expect(loginPage.signinButton).toHaveText('Sign in')
  await loginPage.signIn('standard_user', 'test123')

  await expect(page).toHaveURL(/\/products$/)
  await expect(productsPage.heading).toBeVisible()
})
