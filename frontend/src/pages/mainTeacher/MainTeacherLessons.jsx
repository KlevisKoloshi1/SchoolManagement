import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSubjects, getStudents, addLessonTopic } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'
import { useMainTeacherClass } from '../../contexts/MainTeacherClassContext'

export default function MainTeacherLessons() {
  const { currentClassId } = useMainTeacherClass()
  const [subjects, setSubjects] = useState([])
  const [classInfo, setClassInfo] = useState(null)
  const [homeroomClass, setHomeroomClass] = useState(null)
  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const isViewingHomeroom = currentClassId == null || (homeroomClass && currentClassId === homeroomClass.id)

  useEffect(() => {
    Promise.all([getSubjects(), getStudents(currentClassId ?? undefined)])
      .then(([subj, studentsRes]) => {
        setSubjects(subj.subjects || [])
        setClassInfo(studentsRes.class || null)
        setHomeroomClass(studentsRes.homeroom_class || null)
      })
      .catch(() => {})
      .finally(() => setLoadingCatalog(false))
  }, [currentClassId])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!subjectId) return setError('Subject is required.')
    if (!title.trim()) return setError('Topic title is required.')
    if (!date.trim()) return setError('Date is required.')

    setSubmitting(true)
    try {
      const payload = { subject_id: Number(subjectId), title, date }
      if (description.trim()) payload.description = description.trim()
      if (currentClassId != null) payload.class_id = currentClassId
      await addLessonTopic(payload)
      setSuccess('Lesson topic added.')
      setSubjectId('')
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
        <div className="text-sm text-slate-600">
          Add lesson topics for the class selected on the Dashboard.
        </div>
      </div>

      {classInfo && (
        <p className="text-sm text-slate-700">
          Class: <strong>{classInfo.name}</strong>
          {!isViewingHomeroom && (
            <span className="ml-1 text-slate-500">(viewing as teacher)</span>
          )}
          {' · '}
          <Link to="/main-teacher/dashboard" className="text-blue-600 hover:text-blue-800">
            Change class on Dashboard
          </Link>
        </p>
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
