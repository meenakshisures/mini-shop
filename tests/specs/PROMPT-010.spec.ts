import { expect, test } from '@playwright/test'
import { SettingsPage } from '../pages/SettingsPage'

test('PROMPT-010: Resetting app data shows a toast and logs the user out', async ({ page }) => {
  const settingsPage = new SettingsPage(page)

  await settingsPage.open()
  await settingsPage.resetButton.click()

  await expect(settingsPage.toast).toHaveText('App data has been reset.')
  await expect(page).toHaveURL(/\/login$/)
})
