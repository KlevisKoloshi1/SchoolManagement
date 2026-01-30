import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getSubjects, getClasses, getClassStudents, getLessonTopics, addAbsence } from '../../api/teacher'
import { Alert, Button, Card, Input } from '../../components/ui'

function subjectLabel(t, name) {
  if (!name) return ''
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

export default function TeacherAbsences() {
  const { t } = useTranslation()
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [topics, setTopics] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [classId, setClassId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [lessonTopicId, setLessonTopicId] = useState('')
  const [date, setDate] = useState('')
  const [justified, setJustified] = useState(false)

  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingTopics, setLoadingTopics] = useState(false)
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

  useEffect(() => {
    if (!classId) {
      setStudents([])
      setStudentId('')
      return
    }
    setLoadingStudents(true)
    setStudentId('')
    getClassStudents(Number(classId))
      .then((data) => setStudents(data.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false))
  }, [classId])

  useEffect(() => {
    if (!subjectId || !classId) {
      setTopics([])
      setLessonTopicId('')
      return
    }
    setLessonTopicId('')
    setLoadingTopics(true)
    getLessonTopics(Number(subjectId), Number(classId))
      .then((data) => setTopics(data.lesson_topics || []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false))
  }, [subjectId, classId])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!subjectId) return setError(t('teacher.selectSubject'))
    if (!classId) return setError(t('teacher.selectClass'))
    if (!studentId) return setError(t('teacher.selectStudent'))
    if (!date.trim()) return setError(t('teacher.date') + ' required')

    setSubmitting(true)
    try {
      await addAbsence({
        student_id: Number(studentId),
        subject_id: Number(subjectId),
        lesson_topic_id: lessonTopicId ? Number(lessonTopicId) : undefined,
        date,
        justified,
      })
      setSuccess(t('teacher.recordAbsence') + ' – OK')
      setStudentId('')
      setSubjectId('')
      setLessonTopicId('')
      setClassId('')
      setDate('')
      setJustified(false)
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
        <div className="text-sm text-slate-600">
          Record absences by subject, topic and date. Select subject, class, topic, then student.
        </div>
      </div>

      <Card title="Add Absence">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          {error ? <div className="md:col-span-2"><Alert kind="error">{error}</Alert></div> : null}
          {success ? <div className="md:col-span-2"><Alert kind="success">{success}</Alert></div> : null}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('teacher.selectSubject')}</label>
            <select
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setLessonTopicId('') }}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
            >
              <option value="">{t('teacher.selectSubject')}</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{subjectLabel(t, s.name)}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('teacher.selectClass')}</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
            >
              <option value="">{t('teacher.selectClass')}</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('teacher.topic')}</label>
            <select
              value={lessonTopicId}
              onChange={(e) => setLessonTopicId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              disabled={!subjectId || !classId || loadingTopics}
            >
              <option value="">{t('teacher.selectTopic')}</option>
              {topics.map((tpc) => (
                <option key={tpc.id} value={tpc.id}>{tpc.title} ({tpc.date})</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('teacher.selectStudent')}</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
              disabled={!classId || loadingStudents}
            >
              <option value="">{loadingStudents ? t('common.loading') : !classId ? t('teacher.selectClass') + ' first' : t('teacher.selectStudent')}</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.user.name} – {s.user.email}</option>
              ))}
            </select>
          </div>

          <Input label={t('teacher.date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" id="justified" checked={justified} onChange={(e) => setJustified(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            <label htmlFor="justified" className="text-sm text-slate-700">{t('teacher.justified')}</label>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting || loadingCatalog}>
              {submitting ? 'Saving…' : t('teacher.recordAbsence')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
