import { useState, useEffect } from 'react'
import { createTeacher, getTeachers, deleteTeacher } from '../../api/admin'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function AdminTeachers() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isMainTeacher, setIsMainTeacher] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [created, setCreated] = useState(null)

  // Teachers list state
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [deletingTeacherId, setDeletingTeacherId] = useState(null)

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers()
  }, [])

  async function fetchTeachers() {
    try {
      setLoading(true)
      setFetchError(null)
      const data = await getTeachers()
      setTeachers(data.teachers || [])
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Failed to fetch teachers.')
    } finally {
      setLoading(false)
    }
  }

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
      // Refresh the teachers list
      await fetchTeachers()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create teacher.')
    } finally {
      setSubmitting(false)
    }
  }

  async function onDelete(teacherId, teacherName) {
    if (!confirm(`Are you sure you want to delete teacher "${teacherName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingTeacherId(teacherId)
    try {
      await deleteTeacher(teacherId)
      // Refresh the teachers list
      await fetchTeachers()
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Failed to delete teacher.')
    } finally {
      setDeletingTeacherId(null)
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

      <Card title="Teachers List">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              Loading teachers...
            </div>
          </div>
        ) : fetchError ? (
          <Alert kind="error">{fetchError}</Alert>
        ) : teachers.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No teachers created yet. Create your first teacher above.
          </div>
        ) : (
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-slate-900">{teacher.user.name}</div>
                      <div className="text-sm text-slate-600">{teacher.user.email}</div>
                      <div className="text-xs text-slate-500">
                        Username: {teacher.user.username}
                      </div>
                    </div>
                    {teacher.is_main_teacher && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Main Teacher
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      Created: {new Date(teacher.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      Role: {teacher.user.role}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(teacher.id, teacher.user.name)}
                    disabled={deletingTeacherId === teacher.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    {deletingTeacherId === teacher.id ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </div>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

