import { useTranslation } from 'react-i18next'

export const ROLE = {
  admin: 'admin',
  main_teacher: 'main_teacher',
  teacher: 'teacher',
  student: 'student',
}

export function roleHomePath(role) {
  switch (role) {
    case ROLE.admin:
      return '/admin/dashboard'
    case ROLE.main_teacher:
      return '/main-teacher/dashboard'
    case ROLE.teacher:
      return '/teacher/dashboard'
    case ROLE.student:
      return '/student/dashboard'
    default:
      return '/login'
  }
}

export function navForRole(role) {
  // This function now needs to be called from a component that has access to useTranslation
  // We'll create a hook for this
  switch (role) {
    case ROLE.admin:
      return [
        { to: '/admin/dashboard', labelKey: 'navigation.dashboard' },
        { to: '/admin/teachers', labelKey: 'navigation.teachers' },
        { to: '/admin/activities', labelKey: 'navigation.activities' },
        { to: '/admin/announcements', labelKey: 'navigation.announcements' },
        { to: '/admin/reports', labelKey: 'navigation.reports' },
      ]
    case ROLE.main_teacher:
      return [
        { to: '/main-teacher/dashboard', labelKey: 'navigation.dashboard' },
        { to: '/main-teacher/students', labelKey: 'navigation.students' },
        { to: '/main-teacher/lessons', labelKey: 'mainTeacher.lessons' },
        { to: '/main-teacher/absences', labelKey: 'mainTeacher.absencesTitle' },
        { to: '/main-teacher/grades', labelKey: 'mainTeacher.gradesTitle' },
        { to: '/main-teacher/calendar', labelKey: 'navigation.calendar' },
        { to: '/main-teacher/reports', labelKey: 'navigation.reports' },
      ]
    case ROLE.teacher:
      return [
        { to: '/teacher/dashboard', labelKey: 'navigation.dashboard' },
        { to: '/teacher/lessons', labelKey: 'teacher.lessons' },
        { to: '/teacher/absences', labelKey: 'mainTeacher.absencesTitle' },
        { to: '/teacher/grades', labelKey: 'navigation.grades' },
      ]
    case ROLE.student:
      return [
        { to: '/student/dashboard', labelKey: 'navigation.dashboard' },
        { to: '/student/grades', labelKey: 'navigation.grades' },
        { to: '/student/absences', labelKey: 'mainTeacher.absencesTitle' },
        { to: '/student/calendar', labelKey: 'navigation.calendar' },
        { to: '/student/reports', labelKey: 'navigation.reports' },
      ]
    default:
      return []
  }
}

// Hook to get translated navigation for a role
export function useNavForRole(role) {
  const { t } = useTranslation()
  const navItems = navForRole(role)
  
  return navItems.map(item => ({
    ...item,
    label: t(item.labelKey)
  }))
}
