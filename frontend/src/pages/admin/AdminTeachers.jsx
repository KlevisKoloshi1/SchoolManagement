import { useState } from 'react'
import { createTeacher } from '../../api/admin'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function AdminTeachers() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isMainTeacher, setIsMainTeacher] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [created, setCreated] = useState(null)

  async function onCreate(e) {
    e.preventDefault()
    setError(null)
    setCreated(null)

    if (!name.trim()) return setError('Name is required.')
    if (!email.trim()) return setError('Email is required.')

    setSubmitting(true)
    try {
      const data = await createTeacher({
        name,
        email,
        is_main_teacher: isMainTeacher,
      })
      setCreated(data)
      setName('')
      setEmail('')
      setIsMainTeacher(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create teacher.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Teachers</div>
        <div className="text-sm text-slate-600">Create teachers and show one-time credentials.</div>
      </div>

      <Card title="Add Teacher">
        <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
          {error ? (
            <div className="md:col-span-2">
              <Alert kind="error">{error}</Alert>
            </div>
          ) : null}

          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
            <input
              type="checkbox"
              checked={isMainTeacher}
              onChange={(e) => setIsMainTeacher(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Create as main teacher
          </label>

          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create teacher'}
            </Button>
          </div>
        </form>
      </Card>

      {created?.credentials ? (
        <Card title="Generated credentials (show once)">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500">Username</div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm">
                {created.credentials.username}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Password</div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm">
                {created.credentials.password}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      <Card title="View teachers">
        <Alert>
          The backend currently exposes <span className="font-mono">POST /api/admin/teachers</span> but does not include a
          teachers list endpoint yet. Once you add e.g. <span className="font-mono">GET /api/admin/teachers</span>, we can
          wire it here.
        </Alert>
      </Card>
    </div>
  )
}

