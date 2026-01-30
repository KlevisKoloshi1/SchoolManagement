import { useState } from 'react'
import { addAbsence } from '../../api/teacher'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function TeacherAbsences() {
  const [studentId, setStudentId] = useState('')
  const [absentOn, setAbsentOn] = useState('')
  const [reason, setReason] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!studentId.trim()) return setError('Student ID is required.')
    if (!absentOn.trim()) return setError('Date is required.')

    setSubmitting(true)
    try {
      const data = await addAbsence({
        student_id: Number(studentId),
        absent_on: absentOn,
        reason: reason || null,
      })
      setSuccess(data?.message || 'Absence recorded.')
      setStudentId('')
      setAbsentOn('')
      setReason('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add absence.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Absences</div>
        <div className="text-sm text-slate-600">Record absences.</div>
      </div>

      <Card title="Add Absence">
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
          <Input label="Absent on" type="date" value={absentOn} onChange={(e) => setAbsentOn(e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Record absence'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

