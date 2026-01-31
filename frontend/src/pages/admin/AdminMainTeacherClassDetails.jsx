import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMainTeacherClassDetails } from '../../api/admin'
import { Alert, Card } from '../../components/ui'

export default function AdminMainTeacherClassDetails() {
  const { teacherId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMainTeacherClassDetails(Number(teacherId))
      .then(setData)
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load class details.'))
      .finally(() => setLoading(false))
  }, [teacherId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-slate-600">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          Loading class details...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link to="/admin/teachers" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to teachers
        </Link>
        <Alert kind="error">{error || 'Not found.'}</Alert>
      </div>
    )
  }

  const { teacher, class: schoolClass, students, lesson_topics = [] } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/teachers" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to teachers
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            {teacher.user.name} – {schoolClass.name}
          </h1>
          <p className="text-sm text-slate-600">
            Subject(s): {teacher.subjects?.map((s) => s.name).join(', ') || '—'}
          </p>
        </div>
      </div>

      <Card title={`Lesson topics (${lesson_topics.length})`}>
        {lesson_topics.length === 0 ? (
          <p className="text-slate-500 py-4">No lesson topics recorded for this class yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Subject</th>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lesson_topics.map((topic) => (
                  <tr key={topic.id}>
                    <td className="py-2 text-sm text-slate-900">{topic.date || '—'}</td>
                    <td className="py-2 text-sm text-slate-600">{topic.subject?.name || '—'}</td>
                    <td className="py-2 text-sm text-slate-900">{topic.title}</td>
                    <td className="py-2 text-sm text-slate-600 max-w-xs truncate">{topic.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title={`Students (${students.length})`}>
        {students.length === 0 ? (
          <p className="text-slate-500 py-4">No students in this class yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Username</th>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Grades</th>
                  <th className="py-2 text-left text-xs font-medium text-slate-500 uppercase">Absences</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="py-2 text-sm text-slate-900">{student.user.name}</td>
                    <td className="py-2 text-sm text-slate-600">{student.user.email}</td>
                    <td className="py-2 text-sm text-slate-600 font-mono">{student.user.username}</td>
                    <td className="py-2 text-sm text-slate-600">
                      {student.grades?.length
                        ? student.grades.map((g) => `Grade ${g.grade} (${g.date})`).join(', ')
                        : '—'}
                    </td>
                    <td className="py-2 text-sm text-slate-600">
                      {student.absences?.length
                        ? student.absences.map((a) => `${a.date}${a.justified ? ' (justified)' : ''}`).join(', ')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
