import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

// Login tests need a logged-out user, so they skip the saved session.
test.use({ storageState: { cookies: [], origins: [] } })

test('PROMPT-001: Login fails with an invalid password', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login('standard_user', 'wrong_pass')

  await expect(loginPage.errorMessage).toHaveText('Invalid username or password.')
  await expect(page).toHaveURL(/\/login$/)
})
