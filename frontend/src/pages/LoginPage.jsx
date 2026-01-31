import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'
import { roleHomePath } from '../router/roleNav'
import { Alert, Button, Card, Input } from '../components/ui'
import { Logo } from '../components/Logo'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

export default function LoginPage() {
  const { t } = useTranslation()
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
    if (!login.trim()) next.login = t('auth.emailOrUsernameRequired')
    if (!password) next.password = t('auth.passwordRequired')
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      console.log('Attempting login with:', { login })
      const user = await signIn({ login, password })
      console.log('Login successful, user role:', user.role)
      
      // Navigate immediately to the correct dashboard
      const targetPath = from || roleHomePath(user.role)
      console.log('Navigating to:', targetPath)
      navigate(targetPath, { replace: true })
    } catch (err) {
      console.error('Login failed:', err)
      const message = err?.response?.data?.message || err?.message || t('auth.loginFailed')
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative">
      {/* Language Switcher - Top Right Corner */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher compact />
      </div>
      
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
                alt={t('school.schoolManagement')} 
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">{t('auth.welcomeBack')}</h1>
          <p className="text-text-secondary text-sm">{t('auth.signInDescription')}</p>
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
              label={t('auth.emailOrUsername')}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder={t('auth.enterEmailOrUsername')}
              autoComplete="username"
              error={fieldErrors.login}
            />
            
            <Input
              label={t('common.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.enterPassword')}
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
                  {t('auth.signingIn')}
                </div>
              ) : (
                t('auth.signIn')
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
            {t('auth.needHelp')}
          </p>
        </div>
      </div>
    </div>
  )
}