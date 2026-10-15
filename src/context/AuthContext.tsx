import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { users } from '../data/users'
import { messages } from '../data/messages'

const AUTH_STORAGE_KEY = 'mini-shop-user'

interface AuthContextValue {
  user: string | null
  login: (username: string, password: string) => Promise<string | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(() =>
    localStorage.getItem(AUTH_STORAGE_KEY),
  )

  async function login(username: string, password: string): Promise<string | null> {
    if (!username.trim()) return messages.usernameRequired
    if (!password) return messages.passwordRequired

    const account = users.find((candidate) => candidate.username === username)
    if (!account || account.password !== password) return messages.invalidCredentials
    if (account.status === 'locked') return messages.lockedUser

    if (account.status === 'slow') {
      await new Promise((resolve) => window.setTimeout(resolve, 3000))
    }

    localStorage.setItem(AUTH_STORAGE_KEY, account.username)
    setUser(account.username)
    return null
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

// The provider and its hook are intentionally kept together.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }
  return context
}
