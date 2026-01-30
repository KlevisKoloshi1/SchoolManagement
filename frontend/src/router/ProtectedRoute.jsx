import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, isBootstrapped } = useAuth()
  const location = useLocation()

  if (!isBootstrapped) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

