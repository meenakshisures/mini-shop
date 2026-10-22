import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

// Needs a logged-out user, so it skips the saved login session.
test.use({ storageState: { cookies: [], origins: [] } })

test('TC-002: Login fails with wrong password', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login('standard_user', 'wrong_pass')

  await expect(loginPage.errorMessage).toHaveText('Invalid username or password.')
  await expect(page).toHaveURL(/\/login$/)
})
