import type { Locator, Page } from '@playwright/test'

export class SettingsPage {
  readonly resetButton: Locator
  readonly logoutButton: Locator
  readonly toast: Locator

  constructor(private readonly page: Page) {
    this.resetButton = page.getByTestId('reset-data-button')
    this.logoutButton = page.getByTestId('settings-logout-button')
    this.toast = page.getByTestId('toast')
  }

  async open() {
    await this.page.goto('/settings')
  }
}
