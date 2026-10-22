import type { Locator, Page } from '@playwright/test'

export class OrderSuccessPage {
  readonly heading: Locator
  readonly orderNumber: Locator
  readonly orderTotal: Locator

  constructor(page: Page) {
    this.heading = page.getByTestId('order-success-heading')
    this.orderNumber = page.getByTestId('order-number')
    this.orderTotal = page.getByTestId('order-total')
  }
}
