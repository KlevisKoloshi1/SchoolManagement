import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStudents } from '../../api/mainTeacher'
import { Card } from '../../components/ui'

export default function MainTeacherDashboard() {
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents()
      .then((data) => {
        setClassInfo(data.class || null)
        setStudents(data.students || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Main Teacher Dashboard</div>
        <div className="text-sm text-slate-600">Manage your assigned class and students.</div>
      </div>

      {classInfo && (
        <Card title="Your class">
          <p className="text-lg font-medium text-slate-900">{classInfo.name}</p>
          <p className="text-sm text-slate-600 mt-1">
            {loading ? 'Loading...' : `${students.length} student(s) in this class.`}
          </p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/main-teacher/students" className="block">
          <Card title="Students" className="hover:border-slate-400 transition-colors">
            <div className="text-sm text-slate-700">Add and view students in your class.</div>
            {!loading && classInfo && (
              <div className="mt-2 text-sm font-medium text-slate-900">{students.length} students</div>
            )}
          </Card>
        </Link>
        <Card title="Records">
          <div className="text-sm text-slate-700">Add lesson topics, absences, and grades.</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/main-teacher/lessons"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Lessons
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/main-teacher/absences"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Absences
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/main-teacher/grades"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Grades
            </Link>
          </div>
        </Card>
      </div>

      {!loading && students.length > 0 && (
        <Card title="Recent students">
          <ul className="space-y-1">
            {students.slice(0, 5).map((s) => (
              <li key={s.id} className="text-sm text-slate-700">
                {s.user.name} – {s.user.email}
              </li>
            ))}
            {students.length > 5 && (
              <li>
                <Link to="/main-teacher/students" className="text-sm text-blue-600 hover:text-blue-800">
                  View all {students.length} students →
                </Link>
              </li>
            )}
          </ul>
        </Card>
      )}
    </div>
  )
}
