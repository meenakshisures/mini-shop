import { Link, useNavigate } from 'react-router-dom'
import { messages } from '../data/messages'
import { products } from '../data/products'
import { useShop } from '../context/ShopContext'
import { formatPrice } from '../utils/format'

export function CartPage() {
  const { cart, cartTotal, removeFromCart } = useShop()
  const navigate = useNavigate()
  const isEmpty = cart.length === 0

  return (
    <>
      <h1>Cart</h1>
      {isEmpty ? (
        <p data-testid="cart-empty-message">{messages.cartEmpty}</p>
      ) : (
        <table className="cart-table" data-testid="cart-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Qty</th>
              <th scope="col">Price</th>
              <th scope="col">Subtotal</th>
              <th scope="col"><span className="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              const product = products.find((candidate) => candidate.id === item.id)
              if (!product) return null
              return (
                <tr key={item.id} data-testid={`cart-row-${item.id}`}>
                  <td data-testid={`cart-name-${item.id}`}>{product.name}</td>
                  <td data-testid={`cart-qty-${item.id}`}>{item.quantity}</td>
                  <td data-testid={`cart-price-${item.id}`}>{formatPrice(product.price)}</td>
                  <td data-testid={`cart-subtotal-${item.id}`}>
                    {formatPrice(product.price * item.quantity)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="secondary-button"
                      data-testid={`cart-remove-${item.id}`}
                      onClick={() => removeFromCart(item.id)}
                    >
                      {messages.remove}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <p className="cart-total">
        Total: <strong data-testid="cart-total">{formatPrice(cartTotal)}</strong>
      </p>
      <div className="button-row">
        <Link className="secondary-button" to="/products" data-testid="continue-shopping-button">
          Continue shopping
        </Link>
        <button
          type="button"
          className="primary-button"
          data-testid="checkout-button"
          disabled={isEmpty}
          onClick={() => navigate('/checkout')}
        >
          Checkout
        </button>
      </div>
    </>
  )
}
