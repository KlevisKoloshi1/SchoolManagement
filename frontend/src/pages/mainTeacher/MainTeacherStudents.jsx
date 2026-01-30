import { useState } from 'react'
import { addStudent } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function MainTeacherStudents() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [classId, setClassId] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name.trim()) return setError('Student name is required.')
    if (!email.trim()) return setError('Student email is required.')
    if (!classId.trim()) return setError('Class ID is required.')

    setSubmitting(true)
    try {
      const data = await addStudent({ name, email, class_id: Number(classId) })
      setSuccess(data?.message || 'Student added.')
      setName('')
      setEmail('')
      setClassId('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add student.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Students</div>
        <div className="text-sm text-slate-600">Add students to your class.</div>
      </div>

      <Card title="Add Student">
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
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Class ID" value={classId} onChange={(e) => setClassId(e.target.value)} />
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Add student'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

