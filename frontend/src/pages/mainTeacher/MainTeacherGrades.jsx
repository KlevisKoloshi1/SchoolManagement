import { useState, useEffect } from 'react'
import { getStudents, getSubjects, addGrade } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function MainTeacherGrades() {
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [grade, setGrade] = useState('')
  const [date, setDate] = useState('')

  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    Promise.all([getStudents(), getSubjects()])
      .then(([studentsRes, subjectsRes]) => {
        setStudents(studentsRes.students || [])
        setSubjects(subjectsRes.subjects || [])
      })
      .catch(() => {})
      .finally(() => setLoadingCatalog(false))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!studentId) return setError('Student is required.')
    if (!subjectId) return setError('Subject is required.')
    if (!grade.trim()) return setError('Grade is required.')
    if (!date.trim()) return setError('Date is required.')
    const gradeNum = Number(grade)
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) return setError('Grade must be 0–100.')

    setSubmitting(true)
    try {
      await addGrade({
        student_id: Number(studentId),
        subject_id: Number(subjectId),
        grade: gradeNum,
        date,
      })
      setSuccess('Grade recorded.')
      setStudentId('')
      setSubjectId('')
      setGrade('')
      setDate('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add grade.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Grades</div>
        <div className="text-sm text-slate-600">Record grades for your class.</div>
      </div>

      <Card title="Add Grade">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          {error ? (
            <div className="md:col-span-2">
              <Alert kind="error">{error}</Alert>
            </div>
          ) : null}
          {success ? (
            <div className="md:col-span-2">
              <Alert kind="success">{success}</Alert>
            </div>
          ) : null}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Input label="Grade (0–100)" type="number" min={0} max={100} value={grade} onChange={(e) => setGrade(e.target.value)} required />
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting || loadingCatalog}>
              {submitting ? 'Saving…' : 'Record grade'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

