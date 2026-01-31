import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth'
import { setAuthToken, setUnauthorizedHandler } from '../api/axios'

const AuthContext = createContext(null)

const STORAGE_KEY = 'sm_auth_v1'

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeSession(session) {
  try {
    if (!session) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // ignore storage errors (Electron / privacy modes)
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readSession()?.token || null)
  const [user, setUser] = useState(() => readSession()?.user || null)
  const [isBootstrapped, setIsBootstrapped] = useState(false)

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  useEffect(() => {
    // wire once; handler reads latest state via closures on re-render
    setUnauthorizedHandler(() => {
      writeSession(null)
      setToken(null)
      setUser(null)
    })
    setIsBootstrapped(true)
  }, [])

  async function signIn({ login, password }) {
    try {
      const data = await authApi.login({ login, password })
      
      // Validate the response structure
      if (!data || !data.token || !data.user || !data.user.role) {
        throw new Error('Invalid login response from server')
      }
      
      const next = { token: data.token, user: data.user }
      writeSession(next)
      setToken(next.token)
      setUser(next.user)
      
      console.log('Login successful:', { role: data.user.role, user: data.user.name })
      return next.user
    } catch (error) {
      console.error('Login error:', error)
      // Clear any partial state
      writeSession(null)
      setToken(null)
      setUser(null)
      throw error
    }
  }

  async function signOut() {
    try {
      await authApi.logout()
    } catch {
      // best-effort (token may be expired)
    } finally {
      writeSession(null)
      setToken(null)
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(token && user),
      isBootstrapped,
      signIn,
      signOut,
    }),
    [token, user, isBootstrapped],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

