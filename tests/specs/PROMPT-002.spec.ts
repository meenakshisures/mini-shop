import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

// Needs a logged-out user, so it skips the saved login session.
test.use({ storageState: { cookies: [], origins: [] } })

test('PROMPT-002: Locked user cannot log in and sees the correct error', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login('locked_user', 'test123')

  await expect(loginPage.errorMessage).toHaveText('This user has been locked out.')
  await expect(page).toHaveURL(/\/login$/)
})
