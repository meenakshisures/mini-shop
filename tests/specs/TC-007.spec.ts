import { expect, test } from '@playwright/test'

// Needs a logged-out user, so it skips the saved login session.
test.use({ storageState: { cookies: [], origins: [] } })

test('TC-007: Protected page redirects to login when logged out', async ({ page }) => {
  await page.goto('/cart')

  await expect(page).toHaveURL(/\/login$/)
})
