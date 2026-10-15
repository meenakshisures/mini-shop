import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'
import { messages } from '../data/messages'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { uiVersion } = useShop()
  const isV2 = uiVersion === 'v2'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSigningIn(true)

    try {
      const loginError = await login(username, password)
      if (loginError) {
        setError(loginError)
        return
      }
      navigate('/products', { replace: true })
    } finally {
      setIsSigningIn(false)
    }
  }

  const buttonLabel = isSigningIn
    ? messages.signingIn
    : isV2
      ? messages.signinButton
      : messages.loginButton

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-heading">
        <div className="brand-mark" aria-hidden="true">M</div>
        <p className="eyebrow">WELCOME BACK</p>
        <h1 id="login-heading">Sign in to Mini Shop</h1>
        <p className="login-intro">Use your account to continue shopping.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              data-testid="username-input"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              data-testid="password-input"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && (
            <p className="login-error" data-testid="error-message" role="alert">
              {error}
            </p>
          )}
          <button
            className="login-button"
            type="submit"
            data-testid={isV2 ? 'signin-button' : 'login-button'}
            disabled={isSigningIn}
          >
            {buttonLabel}
          </button>
        </form>
      </section>
    </main>
  )
}
