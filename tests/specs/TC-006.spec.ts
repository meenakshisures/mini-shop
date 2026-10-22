import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

// Needs a logged-out user, so it skips the saved login session.
test.use({ storageState: { cookies: [], origins: [] } })

test('TC-006: Slow user sees loading state then logs in', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login('slow_user', 'test123')

  await expect(loginPage.loginButton).toHaveText('Signing in...')
  // The login takes about 3 seconds, so allow more than the default timeout.
  await expect(page).toHaveURL(/\/products$/, { timeout: 10_000 })
})
