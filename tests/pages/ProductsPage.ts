import type { Locator, Page } from '@playwright/test'

export class ProductsPage {
  readonly heading: Locator
  readonly spinner: Locator
  readonly searchInput: Locator
  readonly sortSelect: Locator
  readonly noResultsMessage: Locator
  readonly productCards: Locator
  readonly productNames: Locator

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Products' })
    this.spinner = page.getByTestId('loading-spinner')
    this.searchInput = page.getByTestId('search-input')
    this.sortSelect = page.getByTestId('sort-select')
    this.noResultsMessage = page.getByTestId('no-results-message')
    this.productCards = page.locator('[data-testid^="product-card-"]')
    this.productNames = page.locator('[data-testid^="product-link-"]')
  }

  async open(path = '/products') {
    await this.page.goto(path)
  }

  /** Waits for the loading spinner to go away (1.5s on v1, 4s on v2). */
  async waitForProducts() {
    await this.spinner.waitFor({ state: 'hidden', timeout: 10_000 })
  }

  addToCartButton(productId: string) {
    return this.page.getByTestId(`add-to-cart-${productId}`)
  }

  addToBasketButton(productId: string) {
    return this.page.getByTestId(`add-to-basket-${productId}`)
  }

  removeButton(productId: string) {
    return this.page.getByTestId(`remove-button-${productId}`)
  }

  productCard(productId: string) {
    return this.page.getByTestId(`product-card-${productId}`)
  }

  /** Opens the list, waits for it to load, then clicks "Add to cart" on each product. */
  async addItemsToCart(...productIds: string[]) {
    await this.open()
    await this.waitForProducts()
    for (const productId of productIds) {
      await this.addToCartButton(productId).click()
    }
  }

  async addItemsToBasket(...productIds: string[]) {
    await this.open('/products?ui=v2')
    await this.waitForProducts()
    for (const productId of productIds) {
      await this.addToBasketButton(productId).click()
    }
  }

  async search(text: string) {
    await this.searchInput.fill(text)
  }

  async sortBy(label: string) {
    await this.sortSelect.selectOption({ label })
  }
}
