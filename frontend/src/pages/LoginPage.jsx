import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { roleHomePath } from '../router/roleNav'
import { Alert, Button, Card, Input } from '../components/ui'
import { Logo } from '../components/Logo'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = useMemo(() => location.state?.from?.pathname || null, [location.state])

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  function validate() {
    const next = {}
    if (!login.trim()) next.login = 'Email or username is required.'
    if (!password) next.password = 'Password is required.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      const user = await signIn({ login, password })
      navigate(from || roleHomePath(user.role), { replace: true })
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
              <img 
                src="/icon.ico" 
                alt="School Management Logo" 
                className="w-10 h-10 object-contain absolute inset-0 m-auto"
                onError={(e) => {
                  // Hide the image and show the SVG fallback
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'block'
                }}
              />
              <Logo size={32} className="text-white hidden" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-muted text-sm">Sign in to your School Management account</p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-xl bg-surface/80 border-border-light/50">
          <form onSubmit={onSubmit} className="space-y-5">
            {error ? (
              <Alert kind="error" className="animate-in slide-in-from-top-2 duration-300">
                {error}
              </Alert>
            ) : null}
            
            <Input
              label="Email or Username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Enter your email or username"
              autoComplete="username"
              error={fieldErrors.login}
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={fieldErrors.password}
            />
            
            <Button 
              type="submit" 
              disabled={submitting} 
              className="w-full h-12 text-base font-medium"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <div className="text-xs text-muted-foreground bg-surface/60 backdrop-blur-sm rounded-lg px-3 py-2 inline-block border border-border-light/50">
            <span className="font-medium">API:</span> {import.meta.env.VITE_API_BASE_URL}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  )
}