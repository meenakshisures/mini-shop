import { test as setup, expect } from '@playwright/test'
import { AUTH_FILE } from '../../playwright.config'
import { LoginPage } from '../pages/LoginPage'

// Runs once before all browsers: logs in and saves the session so no test has to.
setup('log in as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login('standard_user', 'test123')
  await expect(page).toHaveURL(/\/products$/)

  await page.context().storageState({ path: AUTH_FILE })
})
