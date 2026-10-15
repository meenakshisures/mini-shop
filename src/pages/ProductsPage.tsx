import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { messages } from '../data/messages'
import { products } from '../data/products'
import type { Product } from '../data/products'
import { useShop } from '../context/ShopContext'
import { formatPrice } from '../utils/format'

type SortKey = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list]
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc': {
      sorted.sort((a, b) => b.price - a.price)
      // DELIBERATE BUG for test validation: the most expensive item ends up last instead of first.
      const [mostExpensive, ...rest] = sorted
      return mostExpensive ? [...rest, mostExpensive] : sorted
    }
  }
}

export function ProductsPage() {
  const { cart, uiVersion, addToCart, removeFromCart } = useShop()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('name-asc')
  const isV2 = uiVersion === 'v2'

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), isV2 ? 4000 : 1500)
    return () => window.clearTimeout(timer)
  }, [isV2])

  const visible = sortProducts(
    products.filter((product) =>
      product.name.toLowerCase().includes(search.trim().toLowerCase()),
    ),
    sort,
  )

  return (
    <>
      <h1>Products</h1>
      <div className="toolbar">
        <div className="form-field">
          <label htmlFor="search">Search products</label>
          <input
            id="search"
            type="search"
            data-testid="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            data-testid="sort-select"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price low-high</option>
            <option value="price-desc">Price high-low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="spinner" data-testid="loading-spinner" role="status" aria-label="Loading products" />
      ) : visible.length === 0 ? (
        <p data-testid="no-results-message">{messages.noProductsFound}</p>
      ) : (
        <ul className="product-grid" data-testid="product-list">
          {visible.map((product) => {
            const inCart = cart.some((item) => item.id === product.id)
            return (
              <li className="product-card" key={product.id} data-testid={`product-card-${product.id}`}>
                <h2>
                  <Link to={`/products/${product.id}`} data-testid={`product-link-${product.id}`}>
                    {product.name}
                  </Link>
                </h2>
                <p className="price" data-testid={`product-price-${product.id}`}>
                  {formatPrice(product.price)}
                </p>
                {inCart ? (
                  <button
                    type="button"
                    className="secondary-button"
                    data-testid={`remove-button-${product.id}`}
                    onClick={() => removeFromCart(product.id)}
                  >
                    {messages.remove}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    data-testid={isV2 ? `add-to-basket-${product.id}` : `add-to-cart-${product.id}`}
                    onClick={() => addToCart(product.id)}
                  >
                    {isV2 ? messages.addToBasket : messages.addToCart}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
