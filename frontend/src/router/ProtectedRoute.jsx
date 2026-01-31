import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ROLE, roleHomePath } from './roleNav'

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

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, isBootstrapped, user, signOut } = useAuth()
  const location = useLocation()
  const effectiveRole = normalizeRole(role ?? user?.role) ?? role ?? user?.role

  // Wait for auth to bootstrap before making decisions
  if (!isBootstrapped) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // If role-based protection is enabled, check if user has required role
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
      // If user has a valid role but is accessing wrong section, redirect to their dashboard
      if (effectiveRole && VALID_ROLES.includes(effectiveRole)) {
        const correctPath = roleHomePath(effectiveRole)
        console.log('Redirecting to correct dashboard:', { effectiveRole, correctPath })
        return <Navigate to={correctPath} replace />
      }
      
      // If role is invalid, redirect to their home path or login
      console.warn('Invalid role, redirecting to login:', { effectiveRole, allowedRoles })
      return <Navigate to="/login" replace />
    }
  }

  return <Outlet />
}

