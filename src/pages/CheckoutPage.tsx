import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { messages } from '../data/messages'
import { useShop } from '../context/ShopContext'
import { formatPrice } from '../utils/format'

type Shipping = 'standard' | 'express'

interface FormErrors {
  fullName?: string
  email?: string
  address?: string
  terms?: string
}

function shippingCost(shipping: Shipping): number {
  // DELIBERATE BUG for test validation: Express shipping adds $1 instead of $10.
  return shipping === 'express' ? 1 : 0
}

export function CheckoutPage() {
  const { cart, cartTotal, clearCart, placeOrder } = useShop()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [shipping, setShipping] = useState<Shipping>('standard')
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [confirming, setConfirming] = useState(false)
  const [placing, setPlacing] = useState(false)

  if (cart.length === 0 && !placing) return <Navigate to="/cart" replace />

  const grandTotal = cartTotal + shippingCost(shipping)

  function validate(): FormErrors {
    const found: FormErrors = {}
    if (!fullName.trim()) found.fullName = messages.fullNameRequired
    if (!email.trim()) found.email = messages.emailRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found.email = messages.emailInvalid
    if (!address.trim()) found.address = messages.addressRequired
    if (!accepted) found.terms = messages.termsRequired
    return found
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length === 0) setConfirming(true)
  }

  function confirmOrder() {
    setPlacing(true)
    window.setTimeout(() => {
      placeOrder(grandTotal)
      clearCart()
      navigate('/order-success', { replace: true })
    }, 2000)
  }

  return (
    <>
      <h1>Checkout</h1>
      <form className="checkout-form" noValidate onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="full-name">Full name</label>
          <input
            id="full-name"
            type="text"
            data-testid="fullname-input"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          {errors.fullName && <p className="field-error" data-testid="fullname-error">{errors.fullName}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            data-testid="email-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errors.email && <p className="field-error" data-testid="email-error">{errors.email}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            data-testid="address-input"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          {errors.address && <p className="field-error" data-testid="address-error">{errors.address}</p>}
        </div>

        <fieldset className="option-group">
          <legend>Shipping method</legend>
          <label htmlFor="shipping-standard">
            <input
              id="shipping-standard"
              type="radio"
              name="shipping"
              value="standard"
              data-testid="shipping-standard"
              checked={shipping === 'standard'}
              onChange={() => setShipping('standard')}
            />
            Standard (Free)
          </label>
          <label htmlFor="shipping-express">
            <input
              id="shipping-express"
              type="radio"
              name="shipping"
              value="express"
              data-testid="shipping-express"
              checked={shipping === 'express'}
              onChange={() => setShipping('express')}
            />
            Express (+$10.00)
          </label>
        </fieldset>

        <div className="checkbox-field">
          <input
            id="terms"
            type="checkbox"
            data-testid="terms-checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <label htmlFor="terms">I accept the terms</label>
        </div>
        {errors.terms && <p className="field-error" data-testid="terms-error">{errors.terms}</p>}

        <dl className="order-summary">
          <dt>Subtotal</dt>
          <dd data-testid="summary-subtotal">{formatPrice(cartTotal)}</dd>
          <dt>Shipping</dt>
          <dd data-testid="summary-shipping">{formatPrice(shippingCost(shipping))}</dd>
          <dt>Total</dt>
          <dd data-testid="summary-total">{formatPrice(grandTotal)}</dd>
        </dl>

        <button type="submit" className="primary-button" data-testid="place-order-button">
          Place order
        </button>
      </form>

      {confirming && (
        <div className="modal-backdrop">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            data-testid="confirm-modal"
          >
            <h2 id="confirm-title">Confirm your order</h2>
            <p>
              Total to pay: <strong data-testid="modal-total">{formatPrice(grandTotal)}</strong>
            </p>
            <div className="button-row">
              <button
                type="button"
                className="secondary-button"
                data-testid="cancel-order-button"
                disabled={placing}
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button"
                data-testid="confirm-order-button"
                disabled={placing}
                onClick={confirmOrder}
              >
                {placing ? messages.placingOrder : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
