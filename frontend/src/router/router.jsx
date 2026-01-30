import { Navigate, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import { ROLE, roleHomePath } from './roleNav'
import { useAuth } from '../auth/AuthContext'

import LoginPage from '../pages/LoginPage'
import UnauthorizedPage from '../pages/UnauthorizedPage'
import NotFoundPage from '../pages/NotFoundPage'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminTeachers from '../pages/admin/AdminTeachers'

import MainTeacherDashboard from '../pages/mainTeacher/MainTeacherDashboard'
import MainTeacherStudents from '../pages/mainTeacher/MainTeacherStudents'
import MainTeacherLessons from '../pages/mainTeacher/MainTeacherLessons'
import MainTeacherAbsences from '../pages/mainTeacher/MainTeacherAbsences'
import MainTeacherGrades from '../pages/mainTeacher/MainTeacherGrades'

import TeacherDashboard from '../pages/teacher/TeacherDashboard'
import TeacherLessons from '../pages/teacher/TeacherLessons'
import TeacherAbsences from '../pages/teacher/TeacherAbsences'
import TeacherGrades from '../pages/teacher/TeacherGrades'

import StudentDashboard from '../pages/student/StudentDashboard'
import StudentGrades from '../pages/student/StudentGrades'
import StudentAbsences from '../pages/student/StudentAbsences'

function RootRedirect() {
  const { role, isAuthenticated, isBootstrapped } = useAuth()
  if (!isBootstrapped) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={roleHomePath(role)} replace />
}

export function makeRouter() {
  return createBrowserRouter([
    { path: '/', element: <RootRedirect /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/unauthorized', element: <UnauthorizedPage /> },

    {
      element: <ProtectedRoute allowedRoles={[ROLE.admin]} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/admin/dashboard', element: <AdminDashboard /> },
            { path: '/admin/teachers', element: <AdminTeachers /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={[ROLE.main_teacher]} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/main-teacher/dashboard', element: <MainTeacherDashboard /> },
            { path: '/main-teacher/students', element: <MainTeacherStudents /> },
            { path: '/main-teacher/lessons', element: <MainTeacherLessons /> },
            { path: '/main-teacher/absences', element: <MainTeacherAbsences /> },
            { path: '/main-teacher/grades', element: <MainTeacherGrades /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={[ROLE.teacher]} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/teacher/dashboard', element: <TeacherDashboard /> },
            { path: '/teacher/lessons', element: <TeacherLessons /> },
            { path: '/teacher/absences', element: <TeacherAbsences /> },
            { path: '/teacher/grades', element: <TeacherGrades /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={[ROLE.student]} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/student/dashboard', element: <StudentDashboard /> },
            { path: '/student/grades', element: <StudentGrades /> },
            { path: '/student/absences', element: <StudentAbsences /> },
          ],
        },
      ],
    },

    { path: '*', element: <NotFoundPage /> },
  ])
}

