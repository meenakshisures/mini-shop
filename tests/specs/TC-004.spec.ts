import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

// Needs a logged-out user, so it skips the saved login session.
test.use({ storageState: { cookies: [], origins: [] } })

test('TC-004: Login fails with empty username', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login('', 'test123')

  await expect(loginPage.errorMessage).toHaveText('Username is required.')
})
