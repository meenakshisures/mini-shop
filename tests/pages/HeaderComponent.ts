import type { Locator, Page } from '@playwright/test'

export class HeaderComponent {
  readonly cartBadge: Locator
  readonly cartLink: Locator
  readonly productsLink: Locator
  readonly settingsLink: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.cartBadge = page.getByTestId('cart-badge')
    this.cartLink = page.getByTestId('cart-link')
    this.productsLink = page.getByTestId('nav-products-link')
    this.settingsLink = page.getByTestId('nav-settings-link')
    this.logoutButton = page.getByTestId('logout-button')
  }
}
