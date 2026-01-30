import { useState, useEffect } from 'react'
import { getSubjects, getClasses, getClassStudents, addGrade } from '../../api/teacher'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function TeacherGrades() {
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [classId, setClassId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [grade, setGrade] = useState('')
  const [date, setDate] = useState('')

  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    Promise.all([getSubjects(), getClasses()])
      .then(([subj, cls]) => {
        setSubjects(subj.subjects || [])
        setClasses(cls.classes || [])
      })
      .catch(() => {})
      .finally(() => setLoadingCatalog(false))
  }, [])

  useEffect(() => {
    if (!classId) {
      setStudents([])
      setStudentId('')
      return
    }
    setLoadingStudents(true)
    setStudentId('')
    getClassStudents(Number(classId))
      .then((data) => setStudents(data.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false))
  }, [classId])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!subjectId) return setError('Subject is required.')
    if (!classId) return setError('Class is required.')
    if (!studentId) return setError('Student is required.')
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
      setClassId('')
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
        <div className="text-sm text-slate-600">Record grades. Select class, then student and subject.</div>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
              disabled={!classId || loadingStudents}
            >
              <option value="">
                {loadingStudents ? 'Loading...' : !classId ? 'Select class first' : 'Select student'}
              </option>
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
