import type { Locator, Page } from '@playwright/test'

export class ProductDetailPage {
  readonly name: Locator
  readonly price: Locator
  // No data-testid on these two on purpose: role/label locators.
  readonly quantitySelect: Locator
  readonly addToCartButton: Locator
  readonly addedMessage: Locator

  constructor(private readonly page: Page) {
    this.name = page.getByTestId('product-name')
    this.price = page.getByTestId('product-price')
    this.quantitySelect = page.getByLabel('Quantity')
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' })
    this.addedMessage = page.getByTestId('added-message')
  }

  async open(productId: string) {
    await this.page.goto(`/products/${productId}`)
  }

  async addToCart(quantity: number) {
    await this.quantitySelect.selectOption(String(quantity))
    await this.addToCartButton.click()
  }
}
