import { Link, Navigate } from 'react-router-dom'
import { messages } from '../data/messages'
import { useShop } from '../context/ShopContext'
import { formatPrice } from '../utils/format'

export function OrderSuccessPage() {
  const { getLastOrder } = useShop()
  const order = getLastOrder()

  if (!order) return <Navigate to="/products" replace />

  return (
    <>
      <h1 data-testid="order-success-heading">{messages.orderThanks}</h1>
      <p>
        Order number: <strong data-testid="order-number">{order.number}</strong>
      </p>
      <p>
        Order total: <strong data-testid="order-total">{formatPrice(order.total)}</strong>
      </p>
      <Link className="primary-button" to="/products" data-testid="back-to-shop-button">
        Back to shop
      </Link>
    </>
  )
}
