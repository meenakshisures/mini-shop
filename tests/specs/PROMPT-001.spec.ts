import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

test('Login fails with an invalid password', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login('standard_user', 'wrong_pass')

  await expect(loginPage.errorMessage).toHaveText('Invalid username or password.')
  await expect(page).toHaveURL(/\/login$/)
})
