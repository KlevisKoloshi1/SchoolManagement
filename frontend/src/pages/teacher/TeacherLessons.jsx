import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSubjects, getLessonTopics, addLessonTopic } from '../../api/teacher'
import { useTeacherClass } from '../../contexts/TeacherClassContext'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function TeacherLessons() {
  const { currentClassId } = useTeacherClass()
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    getSubjects()
      .then((d) => setSubjects(d.subjects || []))
      .catch(() => {})
      .finally(() => setLoadingCatalog(false))
  }, [])

  useEffect(() => {
    if (currentClassId == null) {
      setTopics([])
      return
    }
    setLoadingTopics(true)
    getLessonTopics(null, currentClassId)
      .then((d) => setTopics(d.lesson_topics || []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false))
  }, [currentClassId])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!currentClassId) return setError('Select a class on the Dashboard first.')
    if (!subjectId) return setError('Subject is required.')
    if (!title.trim()) return setError('Topic title is required.')
    if (!date.trim()) return setError('Date is required.')

    setSubmitting(true)
    try {
      const payload = { subject_id: Number(subjectId), class_id: currentClassId, title, date }
      if (description.trim()) payload.description = description.trim()
      await addLessonTopic(payload)
      setSuccess('Lesson topic added.')
      setSubjectId('')
      setTitle('')
      setDescription('')
      setDate('')
      getLessonTopics(null, currentClassId)
        .then((d) => setTopics(d.lesson_topics || []))
        .catch(() => {})
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
        <div className="text-sm text-slate-600">
          Add lesson topics. Use the class selected on the Dashboard. Subject options are only those assigned to you by the admin.
        </div>
      </div>

      {!currentClassId && (
        <Alert kind="warning">
          Select a class on the <Link to="/teacher/dashboard" className="underline font-medium">Dashboard</Link> first.
        </Alert>
      )}

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
            {!loadingCatalog && subjects.length === 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                No subjects assigned to you. Ask the admin to assign your subjects.
              </p>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                required
                disabled={!currentClassId || subjects.length === 0}
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
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
            <Button type="submit" disabled={submitting || loadingCatalog || !currentClassId}>
              {submitting ? 'Saving…' : 'Add topic'}
            </Button>
          </div>
        </form>
      </Card>

      {currentClassId && (
        <Card title="Lesson topics (this class)">
          {loadingTopics ? (
            <div className="py-4 text-slate-500">Loading topics…</div>
          ) : topics.length === 0 ? (
            <p className="py-4 text-slate-500">No lesson topics yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {topics.map((t) => (
                <li key={t.id} className="py-3 flex justify-between items-start gap-4">
                  <div>
                    <span className="font-medium text-slate-900">{t.title}</span>
                    {t.subject?.name && <span className="ml-2 text-sm text-slate-500">({t.subject.name})</span>}
                    {t.date && <span className="ml-2 text-sm text-slate-500">{t.date}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  )
}
