import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

export function Header() {
  const { logout } = useAuth()
  const { cartCount } = useShop()

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link className="app-name" to="/products" data-testid="app-name">Mini Shop</Link>
        <nav className="app-nav" aria-label="Main">
          <Link to="/products" data-testid="nav-products-link">Products</Link>
          <Link to="/cart" data-testid="cart-link" aria-label="Cart">
            <span aria-hidden="true">🛒</span>
            <span className="cart-badge" data-testid="cart-badge">{cartCount}</span>
          </Link>
          <Link to="/settings" data-testid="nav-settings-link">Settings</Link>
          <button className="link-button" type="button" data-testid="logout-button" onClick={logout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
