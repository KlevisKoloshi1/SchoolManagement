import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'
import { navForRole, roleHomePath } from '../router/roleNav'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { Button } from '../components/ui'

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
          isActive 
            ? 'bg-primary text-white shadow-soft transform scale-[1.02]' 
            : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:scale-[1.01]',
        ].join(' ')
      }
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </NavLink>
  )
}

export default function DashboardLayout() {
  const { t } = useTranslation()
  const { user, role, signOut } = useAuth()
  const nav = navForRole(role)

  // Add icons to navigation items
  const getNavIcon = (path) => {
    if (path.includes('dashboard')) return '■'
    if (path.includes('students')) return '●'
    if (path.includes('teachers')) return '▲'
    if (path.includes('classes')) return '◆'
    if (path.includes('subjects')) return '▼'
    if (path.includes('grades')) return '◗'
    if (path.includes('absences')) return '◐'
    if (path.includes('lessons')) return '◑'
    if (path.includes('reports')) return '◒'
    if (path.includes('settings')) return '◓'
    return '○'
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '●'
      case 'main_teacher': return '▲'
      case 'teacher': return '◆'
      case 'student': return '○'
      default: return '◐'
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return t('roles.Administrator')
      case 'main_teacher': return t('roles.Main Teacher')
      case 'teacher': return t('roles.Teacher')
      case 'student': return t('roles.Student')
      default: return role
    }
  }

  return (
    <div className="h-full bg-background">
      <div className="flex h-full">
        <aside className="w-72 border-r border-border bg-surface shadow-soft flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-xl">
                ■
              </div>
              <div>
                <div className="text-lg font-bold text-text-primary">
                  {t('school.schoolManagement')}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>{getRoleIcon(role)}</span>
                  <span>{getRoleLabel(role)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {nav.map((item) => (
              <NavItem 
                key={item.to} 
                to={item.to} 
                label={item.label}
                icon={getNavIcon(item.to)}
              />
            ))}
          </div>

          {/* User section - Always at bottom */}
          <div className="border-t border-border bg-surface p-4 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-text-primary truncate">
                  {user?.name}
                </div>
                <div className="text-xs text-text-secondary truncate">
                  {user?.email || user?.username}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.href = roleHomePath(role)}
                className="flex-1"
              >
                {t('navigation.dashboard')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={signOut}
                className="flex-1"
              >
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto relative bg-background">
          {/* Language Switcher positioned at top right */}
          <div className="absolute top-6 right-6 z-10">
            <LanguageSwitcher compact />
          </div>
          
          <div className="mx-auto max-w-7xl p-6 pb-20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

