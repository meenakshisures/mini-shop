import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { messages } from '../data/messages'
import { products } from '../data/products'
import { useShop } from '../context/ShopContext'
import { formatPrice } from '../utils/format'

export function ProductDetailPage() {
  const { id } = useParams()
  const { uiVersion, addToCart } = useShop()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const product = products.find((candidate) => candidate.id === id)

  if (!product) {
    return (
      <>
        <p data-testid="product-not-found">{messages.productNotFound}</p>
        <Link to="/products" data-testid="back-to-products-link">Back to products</Link>
      </>
    )
  }

  return (
    <>
      <Link to="/products" data-testid="back-to-products-link">Back to products</Link>
      <h1 data-testid="product-name">{product.name}</h1>
      <p className="price" data-testid="product-price">{formatPrice(product.price)}</p>
      <p data-testid="product-description">{product.description}</p>

      {/* No data-testid on the quantity selector and the add button, on purpose:
          the agent has to use role/label locators here. */}
      <div className="form-field narrow">
        <label htmlFor="quantity">Quantity</label>
        <select
          id="quantity"
          value={quantity}
          onChange={(event) => {
            setQuantity(Number(event.target.value))
            setAdded(false)
          }}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="primary-button"
        onClick={() => {
          addToCart(product.id, quantity)
          setAdded(true)
        }}
      >
        {uiVersion === 'v2' ? messages.addToBasket : messages.addToCart}
      </button>
      {added && (
        <p className="success-text" role="status" data-testid="added-message">
          {messages.addedToCart}
        </p>
      )}
    </>
  )
}
