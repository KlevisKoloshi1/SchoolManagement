import { useState, useEffect } from 'react'
import { getStudents, addStudent } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function MainTeacherStudents() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    try {
      setLoading(true)
      setFetchError(null)
      const data = await getStudents()
      setClassInfo(data.class || null)
      setStudents(data.students || [])
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Failed to load students.')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!name.trim()) return setError('Student name is required.')
    if (!email.trim()) return setError('Student email is required.')

    setSubmitting(true)
    try {
      await addStudent({ name, email })
      setSuccess('Student added to your class.')
      setName('')
      setEmail('')
      await fetchStudents()
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
        <div className="text-sm text-slate-600">
          Add students to your class. Class is set by admin; you only enter name and email.
        </div>
      </div>

      {classInfo && (
        <p className="text-sm text-slate-700">
          Your class: <strong>{classInfo.name}</strong>
        </p>
      )}

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
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Add student'}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Students in your class">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-600">Loading...</div>
        ) : fetchError ? (
          <Alert kind="error">{fetchError}</Alert>
        ) : students.length === 0 ? (
          <p className="text-slate-500 py-4">No students yet. Add your first student above.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {students.map((s) => (
              <li key={s.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-slate-900">{s.user.name}</div>
                  <div className="text-sm text-slate-600">{s.user.email}</div>
                  <div className="text-xs text-slate-500 font-mono">{s.user.username}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
