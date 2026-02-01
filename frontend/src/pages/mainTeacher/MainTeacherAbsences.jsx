import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getStudents, getSubjects, getLessonTopics, addAbsence } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'
import { useMainTeacherClass } from '../../contexts/MainTeacherClassContext'

function subjectLabel(t, name) {
  if (!name) return ''
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

export default function MainTeacherAbsences() {
  const { t } = useTranslation()
  const { currentClassId } = useMainTeacherClass()
  const [homeroomClass, setHomeroomClass] = useState(null)
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
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
    async function load() {
      setLoadingCatalog(true)
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          getStudents(currentClassId ?? undefined),
          getSubjects(currentClassId ?? undefined),
        ])
        setHomeroomClass(studentsRes.homeroom_class || null)
        setClassInfo(studentsRes.class || null)
        setStudents(studentsRes.students || [])
        setSubjects(subjectsRes.subjects || [])
      } catch {
        setStudents([])
        setClassInfo(null)
      } finally {
        setLoadingCatalog(false)
      }
    }
    load()
  }, [currentClassId])

  useEffect(() => {
    if (!subjectId || !classInfo?.id) {
      setTopics([])
      setLessonTopicId('')
      return
    }
    setLessonTopicId('')
    setLoadingTopics(true)
    getLessonTopics(Number(subjectId), classInfo.id)
      .then((data) => setTopics(data.lesson_topics || []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false))
  }, [subjectId, classInfo?.id])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!studentId) return setError(t('mainTeacher.selectStudent'))
    if (!subjectId) return setError(t('mainTeacher.selectSubject'))
    if (!date.trim()) return setError(t('mainTeacher.date') + ' ' + t('common.required') + '.')

    setSubmitting(true)
    try {
      await addAbsence({
        student_id: Number(studentId),
        subject_id: Number(subjectId),
        lesson_topic_id: lessonTopicId ? Number(lessonTopicId) : undefined,
        date,
        justified,
      })
      setSuccess(t('mainTeacher.recordAbsence') + ' – OK')
      setStudentId('')
      setSubjectId('')
      setLessonTopicId('')
      setDate('')
      setJustified(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add absence.')
    } finally {
      setSubmitting(false)
    }
  }

  const isViewingHomeroom = currentClassId == null || (homeroomClass && currentClassId === homeroomClass.id)

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">{t('mainTeacher.absencesTitle')}</div>
        <div className="text-sm text-slate-600">Record absences by subject, topic and date.</div>
      </div>

      {classInfo && (
        <p className="text-sm text-slate-700">
          {t('mainTeacher.yourClass')}: <strong>{classInfo.name}</strong>
          {!isViewingHomeroom && (
            <span className="ml-1 text-slate-500">({t('mainTeacher.viewingAsTeacher')})</span>
          )}
          {' · '}
          <Link to="/main-teacher/dashboard" className="text-blue-600 hover:text-blue-800">
            {t('mainTeacher.changeClassOnDashboard') || 'Change class on Dashboard'}
          </Link>
        </p>
      )}

      <Card title="Add Absence">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          {error ? <div className="md:col-span-2"><Alert kind="error">{error}</Alert></div> : null}
          {success ? <div className="md:col-span-2"><Alert kind="success">{success}</Alert></div> : null}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('mainTeacher.selectSubject')}</label>
            {!loadingCatalog && subjects.length === 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {t('mainTeacher.noSubjectsAssigned')}
              </p>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => { setSubjectId(e.target.value); setLessonTopicId('') }}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                required
                disabled={subjects.length === 0}
              >
                <option value="">{t('mainTeacher.selectSubject')}</option>
                {subjects.map((s) => (
                  <option key={s.id} value={String(s.id)}>{subjectLabel(t, s.name)}</option>
                ))}
              </select>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('mainTeacher.topic')}</label>
            <select
              value={lessonTopicId}
              onChange={(e) => setLessonTopicId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              disabled={!subjectId || !classInfo?.id || loadingTopics}
            >
              <option value="">{t('mainTeacher.selectTopic')} ({t('mainTeacher.addNewTopic')})</option>
              {topics.map((tpc) => (
                <option key={tpc.id} value={tpc.id}>{tpc.title} ({tpc.date})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('mainTeacher.selectStudent')}</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
              disabled={loadingCatalog}
            >
              <option value="">{t('mainTeacher.selectStudent')}</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.user.name} – {s.user.email || s.user.username}</option>
              ))}
            </select>
          </div>

          <Input label={t('mainTeacher.date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" id="justified" checked={justified} onChange={(e) => setJustified(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            <label htmlFor="justified" className="text-sm text-slate-700">{t('mainTeacher.justified')}</label>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting || loadingCatalog}>
              {submitting ? t('mainTeacher.saving') : t('mainTeacher.recordAbsence')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
