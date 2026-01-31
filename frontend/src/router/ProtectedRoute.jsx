import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, isBootstrapped } = useAuth()
  const location = useLocation()

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
    if (!role || !allowedRoles.includes(role)) {
      console.log('Role check failed:', { userRole: role, allowedRoles })
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <Outlet />
}

