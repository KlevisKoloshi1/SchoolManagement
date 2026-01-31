import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStudents, getClasses } from '../../api/mainTeacher'
import { Card } from '../../components/ui'
import { useMainTeacherClass } from '../../contexts/MainTeacherClassContext'

export default function MainTeacherDashboard() {
  const { currentClassId, setCurrentClassId } = useMainTeacherClass()
  const [classInfo, setClassInfo] = useState(null)
  const [homeroomClass, setHomeroomClass] = useState(null)
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const classIdParam = currentClassId ?? undefined
    Promise.all([
      getStudents(classIdParam),
      getClasses(),
    ])
      .then(([data, classesRes]) => {
        setHomeroomClass(data.homeroom_class || null)
        setClassInfo(data.class || null)
        setStudents(data.students || [])
        setClasses(classesRes.classes || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [currentClassId])

  const isViewingHomeroom = currentClassId == null || (homeroomClass && currentClassId === homeroomClass.id)

  function handleClassChange(e) {
    const val = e.target.value
    setCurrentClassId(val === '' ? null : Number(val))
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Main Teacher Dashboard</div>
        <div className="text-sm text-slate-600">Manage your assigned class and students.</div>
      </div>

      {/* Class selector: default is own class; changing shows teacher-like view */}
      {homeroomClass && classes.length > 0 && (
        <Card title="Current class">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-slate-700">View class:</label>
            <select
              value={currentClassId ?? ''}
              onChange={handleClassChange}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              <option value="">My class ({homeroomClass.name})</option>
              {classes.filter((c) => c.id !== homeroomClass.id).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {!isViewingHomeroom && classInfo && (
              <span className="text-sm text-slate-500">
                Viewing as teacher – {classInfo.name}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {isViewingHomeroom
              ? 'Your homeroom class. You can add students and manage records here.'
              : 'Viewing another class. Same interface as a regular teacher (view and add records only).'}
          </p>
        </Card>
      )}

      {classInfo && (
        <Card title={isViewingHomeroom ? 'Your class' : `Class: ${classInfo.name}`}>
          <p className="text-lg font-medium text-slate-900">{classInfo.name}</p>
          <p className="text-sm text-slate-600 mt-1">
            {loading ? 'Loading...' : `${students.length} student(s) in this class.`}
          </p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/main-teacher/students" className="block">
          <Card title="Students" className="hover:border-slate-400 transition-colors">
            <div className="text-sm text-slate-700">
              {isViewingHomeroom ? 'Add and view students in your class.' : 'View students in this class.'}
            </div>
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
