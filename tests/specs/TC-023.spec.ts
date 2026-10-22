import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { HeaderComponent } from '../pages/HeaderComponent'

test('TC-023: UI v2 add to basket from the product list', async ({ page }) => {
  const productsPage = new ProductsPage(page)
  const header = new HeaderComponent(page)

  await productsPage.open('/products?ui=v2')
  // The v2 product list takes about 4 seconds to load.
  await productsPage.waitForProducts()
  await productsPage.addToBasketButton('ceramic-mug').click()

  await expect(header.cartBadge).toHaveText('1')
})
