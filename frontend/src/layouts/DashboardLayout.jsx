import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'
import { navForRole, roleHomePath } from '../router/roleNav'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'block rounded-md px-3 py-2 text-sm font-medium',
          isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export default function DashboardLayout() {
  const { t } = useTranslation()
  const { user, role, signOut } = useAuth()
  const nav = navForRole(role)

  return (
    <div className="h-full">
      <div className="flex h-full">
        <aside className="w-64 border-r border-slate-200 bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">{t('school.schoolManagement')}</div>
              <div className="text-xs text-slate-500">{t('common.role')}: {role || '—'}</div>
            </div>
            <LanguageSwitcher compact />
          </div>

          <div className="px-2">
            {nav.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} />
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200 px-4 py-4">
            <div className="text-xs text-slate-500">{t('auth.signedInAs')}</div>
            <div className="text-sm font-medium text-slate-900">{user?.name}</div>
            <div className="text-xs text-slate-600">{user?.email || user?.username}</div>
            <div className="mt-3 flex gap-2">
              <a
                href={roleHomePath(role)}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                {t('navigation.dashboard')}
              </a>
              <button
                onClick={signOut}
                className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {t('common.logout')}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

