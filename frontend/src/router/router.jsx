import { Navigate, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import { ROLE, roleHomePath } from './roleNav'
import { useAuth } from '../auth/AuthContext'

import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminTeachers from '../pages/admin/AdminTeachers'
import AdminMainTeacherClassDetails from '../pages/admin/AdminMainTeacherClassDetails'
import AdminActivities from '../pages/admin/AdminActivities'
import AdminAnnouncements from '../pages/admin/AdminAnnouncements'
import AdminReports from '../pages/admin/AdminReports'

import { MainTeacherClassProvider } from '../contexts/MainTeacherClassContext'
import { TeacherClassProvider } from '../contexts/TeacherClassContext'
import MainTeacherDashboard from '../pages/mainTeacher/MainTeacherDashboard'
import MainTeacherStudents from '../pages/mainTeacher/MainTeacherStudents'
import MainTeacherLessons from '../pages/mainTeacher/MainTeacherLessons'
import MainTeacherAbsences from '../pages/mainTeacher/MainTeacherAbsences'
import MainTeacherGrades from '../pages/mainTeacher/MainTeacherGrades'
import MainTeacherCalendar from '../pages/mainTeacher/MainTeacherCalendar'
import MainTeacherReports from '../pages/mainTeacher/MainTeacherReports'

import TeacherDashboard from '../pages/teacher/TeacherDashboard'
import TeacherLessons from '../pages/teacher/TeacherLessons'
import TeacherAbsences from '../pages/teacher/TeacherAbsences'
import TeacherGrades from '../pages/teacher/TeacherGrades'
import TeacherReports from '../pages/teacher/TeacherReports'

import StudentDashboard from '../pages/student/StudentDashboard'
import StudentGrades from '../pages/student/StudentGrades'
import StudentAbsences from '../pages/student/StudentAbsences'
import StudentCalendar from '../pages/student/StudentCalendar'
import StudentReports from '../pages/student/StudentReports'

function RootRedirect() {
  const { role, isAuthenticated, isBootstrapped, user } = useAuth()
  
  if (!isBootstrapped) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    console.log('RootRedirect: Not authenticated, going to login')
    return <Navigate to="/login" replace />
  }
  
  const homePath = roleHomePath(role)
  console.log('RootRedirect: Authenticated user redirecting to dashboard', { 
    role, 
    homePath, 
    user: user?.name,
    userRole: user?.role
  })
  return <Navigate to={homePath} replace />
}

export function makeRouter() {
  return createBrowserRouter([
    { path: '/', element: <RootRedirect /> },
    { path: '/login', element: <LoginPage /> },



    {
      element: <ProtectedRoute allowedRoles={[ROLE.admin]} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/admin/dashboard', element: <AdminDashboard /> },
            { path: '/admin/teachers', element: <AdminTeachers /> },
            { path: '/admin/teachers/:teacherId/class-details', element: <AdminMainTeacherClassDetails /> },
            { path: '/admin/activities', element: <AdminActivities /> },
            { path: '/admin/announcements', element: <AdminAnnouncements /> },
            { path: '/admin/reports', element: <AdminReports /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={[ROLE.main_teacher]} />,
      children: [
        {
          element: (
            <MainTeacherClassProvider>
              <DashboardLayout />
            </MainTeacherClassProvider>
          ),
          children: [
            { path: '/main-teacher/dashboard', element: <MainTeacherDashboard /> },
            { path: '/main-teacher/students', element: <MainTeacherStudents /> },
            { path: '/main-teacher/lessons', element: <MainTeacherLessons /> },
            { path: '/main-teacher/absences', element: <MainTeacherAbsences /> },
            { path: '/main-teacher/grades', element: <MainTeacherGrades /> },
            { path: '/main-teacher/calendar', element: <MainTeacherCalendar /> },
            { path: '/main-teacher/reports', element: <MainTeacherReports /> },
          ],
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={[ROLE.teacher]} />,
      children: [
        {
          element: (
            <TeacherClassProvider>
              <DashboardLayout />
            </TeacherClassProvider>
          ),
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
            { path: '/student/calendar', element: <StudentCalendar /> },
            { path: '/student/reports', element: <StudentReports /> },
          ],
        },
      ],
    },

    { path: '*', element: <NotFoundPage /> },
  ])
}


