import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

// Needs a logged-out user, so it skips the saved login session.
test.use({ storageState: { cookies: [], origins: [] } })

test('PROMPT-009: Login works with the v2 UI Sign in button', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open('/login?ui=v2')
  await loginPage.signIn('standard_user', 'test123')

  await expect(page).toHaveURL(/\/products$/)
})
