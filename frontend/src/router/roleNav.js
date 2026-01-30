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
  switch (role) {
    case ROLE.admin:
      return [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/teachers', label: 'Teachers' },
      ]
    case ROLE.main_teacher:
      return [
        { to: '/main-teacher/dashboard', label: 'Dashboard' },
        { to: '/main-teacher/students', label: 'Students' },
        { to: '/main-teacher/lessons', label: 'Lessons' },
        { to: '/main-teacher/absences', label: 'Absences' },
        { to: '/main-teacher/grades', label: 'Grades' },
      ]
    case ROLE.teacher:
      return [
        { to: '/teacher/dashboard', label: 'Dashboard' },
        { to: '/teacher/lessons', label: 'Lessons' },
        { to: '/teacher/absences', label: 'Absences' },
        { to: '/teacher/grades', label: 'Grades' },
      ]
    case ROLE.student:
      return [
        { to: '/student/dashboard', label: 'Dashboard' },
        { to: '/student/grades', label: 'Grades' },
        { to: '/student/absences', label: 'Absences' },
      ]
    default:
      return []
  }
}

