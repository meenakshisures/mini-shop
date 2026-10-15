import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ShopProvider } from './context/ShopContext'
import { Layout } from './components/Layout'
import { Toast } from './components/Toast'
import { LoginPage } from './pages/LoginPage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'
import { SettingsPage } from './pages/SettingsPage'
import './App.css'

function ProtectedRoute() {
  const { user } = useAuth()

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/products" replace /> : <LoginPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={user ? '/products' : '/login'} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toast />
      </ShopProvider>
    </AuthProvider>
  )
}

export default App
