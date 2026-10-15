import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { messages } from '../data/messages'
import { products } from '../data/products'
import { useAuth } from './AuthContext'

const CART_KEY = 'mini-shop-cart'
const UI_KEY = 'mini-shop-ui-version'
const ORDER_COUNT_KEY = 'mini-shop-order-count'
const LAST_ORDER_KEY = 'mini-shop-last-order'

export type UiVersion = 'v1' | 'v2'

export interface CartItem {
  id: string
  quantity: number
}

export interface Order {
  number: string
  total: number
}

interface ShopContextValue {
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  uiVersion: UiVersion
  toast: string | null
  setUiVersion: (version: UiVersion) => void
  addToCart: (id: string, quantity?: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  placeOrder: (total: number) => Order
  getLastOrder: () => Order | null
  resetAppData: () => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

function readCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

// ?ui=v2 (or ?ui=v1) switches the UI version and is remembered afterwards.
function readUiVersion(): UiVersion {
  const fromUrl = new URLSearchParams(window.location.search).get('ui')
  if (fromUrl === 'v1' || fromUrl === 'v2') {
    localStorage.setItem(UI_KEY, fromUrl)
    return fromUrl
  }
  return localStorage.getItem(UI_KEY) === 'v2' ? 'v2' : 'v1'
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth()
  const [cart, setCart] = useState<CartItem[]>(readCart)
  const [uiVersion, setUiVersionState] = useState<UiVersion>(readUiVersion)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.id)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)

  function setUiVersion(version: UiVersion) {
    localStorage.setItem(UI_KEY, version)
    setUiVersionState(version)
  }

  // Adding a product that is already in the cart replaces its quantity.
  function addToCart(id: string, quantity = 1) {
    setCart((current) => [...current.filter((item) => item.id !== id), { id, quantity }])
  }

  function removeFromCart(id: string) {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  function placeOrder(total: number): Order {
    const next = Number(localStorage.getItem(ORDER_COUNT_KEY) ?? '0') + 1
    localStorage.setItem(ORDER_COUNT_KEY, String(next))
    const order = { number: `ORD-${String(next).padStart(4, '0')}`, total }
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order))
    return order
  }

  function getLastOrder(): Order | null {
    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY)
      return raw ? (JSON.parse(raw) as Order) : null
    } catch {
      return null
    }
  }

  function resetAppData() {
    setCart([])
    localStorage.removeItem(ORDER_COUNT_KEY)
    localStorage.removeItem(LAST_ORDER_KEY)
    logout()
    setToast(messages.dataReset)
  }

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        uiVersion,
        toast,
        setUiVersion,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        getLastOrder,
        resetAppData,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

// The provider and its hook are intentionally kept together.
// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider.')
  }
  return context
}
