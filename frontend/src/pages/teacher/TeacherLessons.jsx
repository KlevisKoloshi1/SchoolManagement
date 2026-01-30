import { useState, useEffect } from 'react'
import { getSubjects, getClasses, addLessonTopic } from '../../api/teacher'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function TeacherLessons() {
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [classId, setClassId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const [loadingCatalog, setLoadingCatalog] = useState(true)
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

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!subjectId) return setError('Subject is required.')
    if (!classId) return setError('Class is required.')
    if (!title.trim()) return setError('Topic title is required.')
    if (!date.trim()) return setError('Date is required.')

    setSubmitting(true)
    try {
      const payload = { subject_id: Number(subjectId), class_id: Number(classId), title, date }
      if (description.trim()) payload.description = description.trim()
      await addLessonTopic(payload)
      setSuccess('Lesson topic added.')
      setSubjectId('')
      setClassId('')
      setTitle('')
      setDescription('')
      setDate('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add lesson topic.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Lessons</div>
        <div className="text-sm text-slate-600">Add lesson topics. Select subject and class.</div>
      </div>

      <Card title="Add Lesson Topic">
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
            <Input label="Topic title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting || loadingCatalog}>
              {submitting ? 'Saving…' : 'Add topic'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
