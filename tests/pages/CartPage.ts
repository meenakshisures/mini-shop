import type { Locator, Page } from '@playwright/test'

export class CartPage {
  readonly emptyMessage: Locator
  readonly table: Locator
  readonly total: Locator
  readonly checkoutButton: Locator
  readonly continueShoppingButton: Locator

  constructor(private readonly page: Page) {
    this.emptyMessage = page.getByTestId('cart-empty-message')
    this.table = page.getByTestId('cart-table')
    this.total = page.getByTestId('cart-total')
    this.checkoutButton = page.getByTestId('checkout-button')
    this.continueShoppingButton = page.getByTestId('continue-shopping-button')
  }

  async open() {
    await this.page.goto('/cart')
  }

  row(productId: string) {
    return this.page.getByTestId(`cart-row-${productId}`)
  }

  quantity(productId: string) {
    return this.page.getByTestId(`cart-qty-${productId}`)
  }

  subtotal(productId: string) {
    return this.page.getByTestId(`cart-subtotal-${productId}`)
  }

  removeButton(productId: string) {
    return this.page.getByTestId(`cart-remove-${productId}`)
  }
}
