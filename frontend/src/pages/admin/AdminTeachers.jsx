import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createTeacher, getTeachers, deleteTeacher, getClasses, getSubjects } from '../../api/admin'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function AdminTeachers() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isMainTeacher, setIsMainTeacher] = useState(false)
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [subjectIds, setSubjectIds] = useState([])

  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [created, setCreated] = useState(null)

  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [deletingTeacherId, setDeletingTeacherId] = useState(null)

  useEffect(() => {
    fetchTeachers()
  }, [])

  useEffect(() => {
    getSubjects().then((d) => setSubjects(d.subjects || [])).catch(() => setSubjects([]))
    if (isMainTeacher) {
      getClasses({ available_for_main_teacher: true }).then((d) => setClasses(d.classes || [])).catch(() => setClasses([]))
    } else {
      setClassId('')
      setSubjectId('')
      setSubjectIds([])
    }
  }, [isMainTeacher])

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
    if (isMainTeacher) {
      if (!classId) return setError('Class is required for main teacher.')
      if (!subjectId) return setError('Subject is required for main teacher.')
    } else {
      if (!subjectIds?.length) return setError('Select at least one subject.')
    }

    setSubmitting(true)
    try {
      const payload = { name, email, is_main_teacher: isMainTeacher }
      if (isMainTeacher) {
        payload.class_id = Number(classId)
        payload.subject_id = Number(subjectId)
      } else {
        payload.subject_ids = subjectIds.map((id) => Number(id))
      }
      const data = await createTeacher(payload)
      setCreated(data)
      setName('')
      setEmail('')
      setIsMainTeacher(false)
      setClassId('')
      setSubjectId('')
      setSubjectIds([])
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
        <div className="text-sm text-slate-600">Create main teachers (with class and subject) or regular teachers.</div>
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

          {isMainTeacher && (
            <>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Class</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Subject (for main class)</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {!isMainTeacher && subjects.length > 0 && (
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Subjects (this teacher will teach)</label>
              <div className="flex flex-wrap gap-2 border border-slate-300 rounded-md bg-white p-3">
                {subjects.map((s) => (
                  <label key={s.id} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subjectIds.includes(s.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSubjectIds((prev) => [...prev, s.id])
                        } else {
                          setSubjectIds((prev) => prev.filter((id) => id !== s.id))
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-900">{s.name}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">Select at least one subject.</p>
            </div>
          )}

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
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>
                      <div className="font-medium text-slate-900">{teacher.user.name}</div>
                      <div className="text-sm text-slate-600">{teacher.user.email}</div>
                      <div className="text-xs text-slate-500">Username: {teacher.user.username}</div>
                    </div>
                    {teacher.is_main_teacher && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Main Teacher
                      </span>
                    )}
                    {teacher.class && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        Class: {teacher.class.name}
                      </span>
                    )}
                    {teacher.subjects?.length > 0 && (
                      <span className="text-xs text-slate-600">
                        Subject(s): {teacher.subjects.map((s) => s.name).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {teacher.is_main_teacher && teacher.class && (
                    <Link
                      to={`/admin/teachers/${teacher.id}/class-details`}
                      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View class
                    </Link>
                  )}
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
