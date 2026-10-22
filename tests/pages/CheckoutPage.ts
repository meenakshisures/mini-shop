import type { Locator, Page } from '@playwright/test'

export class CheckoutPage {
  readonly fullNameInput: Locator
  readonly emailInput: Locator
  readonly addressInput: Locator
  readonly standardShipping: Locator
  readonly expressShipping: Locator
  readonly termsCheckbox: Locator
  readonly placeOrderButton: Locator
  readonly fullNameError: Locator
  readonly emailError: Locator
  readonly addressError: Locator
  readonly termsError: Locator
  readonly summaryTotal: Locator
  readonly confirmModal: Locator
  readonly confirmButton: Locator

  constructor(page: Page) {
    this.fullNameInput = page.getByTestId('fullname-input')
    this.emailInput = page.getByTestId('email-input')
    this.addressInput = page.getByTestId('address-input')
    this.standardShipping = page.getByTestId('shipping-standard')
    this.expressShipping = page.getByTestId('shipping-express')
    this.termsCheckbox = page.getByTestId('terms-checkbox')
    this.placeOrderButton = page.getByTestId('place-order-button')
    this.fullNameError = page.getByTestId('fullname-error')
    this.emailError = page.getByTestId('email-error')
    this.addressError = page.getByTestId('address-error')
    this.termsError = page.getByTestId('terms-error')
    this.summaryTotal = page.getByTestId('summary-total')
    this.confirmModal = page.getByTestId('confirm-modal')
    this.confirmButton = page.getByTestId('confirm-order-button')
  }

  async fillDetails(fullName: string, email: string, address: string) {
    await this.fullNameInput.fill(fullName)
    await this.emailInput.fill(email)
    await this.addressInput.fill(address)
  }
}
