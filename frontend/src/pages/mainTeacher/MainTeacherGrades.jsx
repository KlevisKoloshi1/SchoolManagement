import { useState } from 'react'
import { addGrade } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function MainTeacherGrades() {
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [grade, setGrade] = useState('')
  const [gradedOn, setGradedOn] = useState('')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!studentId.trim()) return setError('Student ID is required.')
    if (!subjectId.trim()) return setError('Subject ID is required.')
    if (!grade.trim()) return setError('Grade is required.')
    if (!gradedOn.trim()) return setError('Date is required.')

    setSubmitting(true)
    try {
      const data = await addGrade({
        student_id: Number(studentId),
        subject_id: Number(subjectId),
        grade,
        graded_on: gradedOn,
        notes: notes || null,
      })
      setSuccess(data?.message || 'Grade recorded.')
      setStudentId('')
      setSubjectId('')
      setGrade('')
      setGradedOn('')
      setNotes('')
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

          <Input label="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <Input label="Subject ID" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} />
          <Input label="Grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
          <Input label="Graded on" type="date" value={gradedOn} onChange={(e) => setGradedOn(e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Record grade'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

