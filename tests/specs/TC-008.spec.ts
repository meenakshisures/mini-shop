import { expect, test } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test('TC-008: Products load after the spinner', async ({ page }) => {
  const productsPage = new ProductsPage(page)

  await productsPage.open()
  await expect(productsPage.spinner).toBeVisible()
  await expect(productsPage.spinner).toBeHidden({ timeout: 10_000 })

  await expect(productsPage.productCards).toHaveCount(8)
})
