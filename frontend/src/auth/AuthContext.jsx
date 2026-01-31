import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth'
import { setAuthToken, setUnauthorizedHandler } from '../api/axios'
import { ROLE } from '../router/roleNav'

const AuthContext = createContext(null)

const STORAGE_KEY = 'sm_auth_v1'

const VALID_ROLES = [ROLE.admin, ROLE.main_teacher, ROLE.teacher, ROLE.student]

function normalizeRole(role) {
  if (!role || typeof role !== 'string') return null
  const r = role.trim().toLowerCase()
  
  // Direct matches
  if (VALID_ROLES.includes(r)) return r
  
  // Handle variations
  if (r === 'mainteacher' || r === 'main teacher' || r === 'main-teacher') return ROLE.main_teacher
  if (r === 'administrator') return ROLE.admin
  
  // Return original if no normalization needed
  return r
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (session?.user?.role) {
      session.user.role = normalizeRole(session.user.role) || session.user.role
    }
    return session
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
      if (!data || !data.token || !data.user) {
        throw new Error('Invalid login response from server')
      }
      
      const role = normalizeRole(data.user.role) || data.user.role
      const user = { ...data.user, role }
      
      console.log('Login successful:', { 
        originalRole: data.user.role, 
        normalizedRole: role, 
        userName: user.name 
      })
      
      // Set token in axios immediately so the first request after navigate has the token
      setAuthToken(data.token)
      
      const next = { token: data.token, user }
      writeSession(next)
      setToken(next.token)
      setUser(next.user)
      
      return next.user
    } catch (error) {
      console.error('Login error:', error)
      setAuthToken(null)
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
    () => {
      const role = user?.role ? normalizeRole(user.role) || user.role : null
      const authState = {
        token,
        user: user ? { ...user, role } : null,
        role,
        isAuthenticated: Boolean(token && user),
        isBootstrapped,
        signIn,
        signOut,
      }
      return authState
    },
    [token, user, isBootstrapped],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

