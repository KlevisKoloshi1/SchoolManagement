import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getSubjects, getStudents, getLessonTopics, addLessonTopic } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'
import { useMainTeacherClass } from '../../contexts/MainTeacherClassContext'

export default function MainTeacherLessons() {
  const { t } = useTranslation()
  const { currentClassId } = useMainTeacherClass()
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const [classInfo, setClassInfo] = useState(null)
  const [homeroomClass, setHomeroomClass] = useState(null)
  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingTopics, setLoadingTopics] = useState(false)
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

  useEffect(() => {
    const classId = currentClassId ?? homeroomClass?.id
    if (classId == null) {
      setTopics([])
      return
    }
    setLoadingTopics(true)
    getLessonTopics(null, classId)
      .then((d) => setTopics(d.lesson_topics || []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false))
  }, [currentClassId, homeroomClass?.id])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!subjectId) return setError('Subject is required.')
    if (!title.trim()) return setError('Topic title is required.')
    if (!date.trim()) return setError('Date is required.')

    setSubmitting(true)
    try {
      const classId = currentClassId ?? homeroomClass?.id
      const payload = { subject_id: Number(subjectId), title, date }
      if (description.trim()) payload.description = description.trim()
      if (classId != null) payload.class_id = classId
      await addLessonTopic(payload)
      setSuccess('Lesson topic added.')
      setSubjectId('')
      setTitle('')
      setDescription('')
      setDate('')
      if (classId != null) {
        getLessonTopics(null, classId)
          .then((d) => setTopics(d.lesson_topics || []))
          .catch(() => {})
      }
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
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('mainTeacher.selectSubject')}</label>
            {!loadingCatalog && subjects.length === 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {t('mainTeacher.noSubjectsAssigned')}
              </p>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                required
                disabled={subjects.length === 0}
              >
                <option value="">{t('mainTeacher.selectSubject')}</option>
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
            <Button type="submit" disabled={submitting || loadingCatalog}>
              {submitting ? 'Saving…' : 'Add topic'}
            </Button>
          </div>
        </form>
      </Card>

      {(currentClassId != null || homeroomClass?.id != null) && (
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
