import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getStudents, getClasses, getSubjects, getLessonTopics, addGrade } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'

const STORAGE_CLASS_KEY = 'mainTeacher_currentClassId'

function subjectLabel(t, name) {
  if (!name) return ''
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

export default function MainTeacherGrades() {
  const { t } = useTranslation()
  const [classes, setClasses] = useState([])
  const [homeroomClass, setHomeroomClass] = useState(null)
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const [currentClassId, setCurrentClassId] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_CLASS_KEY)
    return stored ? (Number(stored) || null) : null
  })
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [lessonTopicId, setLessonTopicId] = useState('')
  const [grade, setGrade] = useState('')
  const [date, setDate] = useState('')

  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (currentClassId != null) sessionStorage.setItem(STORAGE_CLASS_KEY, String(currentClassId))
    else sessionStorage.removeItem(STORAGE_CLASS_KEY)
  }, [currentClassId])

  useEffect(() => {
    async function load() {
      setLoadingCatalog(true)
      try {
        const [studentsRes, subjectsRes, classesRes] = await Promise.all([
          getStudents(currentClassId ?? undefined),
          getSubjects(),
          getClasses(),
        ])
        setHomeroomClass(studentsRes.homeroom_class || null)
        setClassInfo(studentsRes.class || null)
        setStudents(studentsRes.students || [])
        setSubjects(subjectsRes.subjects || [])
        setClasses(classesRes.classes || [])
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
    if (!grade.trim()) return setError(t('student.grade') + ' required')
    if (!date.trim()) return setError(t('mainTeacher.date') + ' required')
    const gradeNum = Number(grade)
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) return setError('Grade must be 0–100.')

    setSubmitting(true)
    try {
      await addGrade({
        student_id: Number(studentId),
        subject_id: Number(subjectId),
        lesson_topic_id: lessonTopicId ? Number(lessonTopicId) : undefined,
        grade: gradeNum,
        date,
      })
      setSuccess(t('mainTeacher.recordGrade') + ' – OK')
      setStudentId('')
      setSubjectId('')
      setLessonTopicId('')
      setGrade('')
      setDate('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add grade.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClassChange(e) {
    const val = e.target.value
    setCurrentClassId(val === '' ? null : Number(val))
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">{t('mainTeacher.gradesTitle')}</div>
        <div className="text-sm text-slate-600">Record grades by subject, topic and date.</div>
      </div>

      {homeroomClass && classes.length > 0 && (
        <Card title={t('mainTeacher.currentClass')}>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-slate-700">{t('mainTeacher.viewClass')}</label>
            <select
              value={currentClassId ?? ''}
              onChange={handleClassChange}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              <option value="">{t('mainTeacher.myClass')} ({homeroomClass.name})</option>
              {classes.filter((c) => c.id !== homeroomClass.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {currentClassId != null && currentClassId !== homeroomClass?.id && classInfo && (
              <span className="text-sm text-slate-500">{t('mainTeacher.viewingAsTeacher')} – {classInfo.name}</span>
            )}
          </div>
        </Card>
      )}

      <Card title="Add Grade">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          {error ? <div className="md:col-span-2"><Alert kind="error">{error}</Alert></div> : null}
          {success ? <div className="md:col-span-2"><Alert kind="success">{success}</Alert></div> : null}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('mainTeacher.selectSubject')}</label>
            <select
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setLessonTopicId('') }}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              required
            >
              <option value="">{t('mainTeacher.selectSubject')}</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{subjectLabel(t, s.name)}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('mainTeacher.topic')}</label>
            <select
              value={lessonTopicId}
              onChange={(e) => setLessonTopicId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              disabled={!subjectId || !classInfo?.id || loadingTopics}
            >
              <option value="">{t('mainTeacher.selectTopic')}</option>
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
                <option key={s.id} value={s.id}>{s.user.name}</option>
              ))}
            </select>
          </div>

          <Input label={t('student.grade')} type="number" min={0} max={100} value={grade} onChange={(e) => setGrade(e.target.value)} required />
          <Input label={t('mainTeacher.date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting || loadingCatalog}>
              {submitting ? t('mainTeacher.saving') : t('mainTeacher.recordGrade')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
