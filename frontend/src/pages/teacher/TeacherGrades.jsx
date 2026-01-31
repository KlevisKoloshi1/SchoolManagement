import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getSubjects, getClassStudents, getLessonTopics, addGrade } from '../../api/teacher'
import { useTeacherClass } from '../../contexts/TeacherClassContext'
import { Alert, Button, Card, Input } from '../../components/ui'

function subjectLabel(t, name) {
  if (!name) return ''
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

export default function TeacherGrades() {
  const { t } = useTranslation()
  const { currentClassId } = useTeacherClass()
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [topics, setTopics] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [lessonTopicId, setLessonTopicId] = useState('')
  const [grade, setGrade] = useState('')
  const [date, setDate] = useState('')

  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
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
    if (!currentClassId) {
      setStudents([])
      setStudentId('')
      return
    }
    setLoadingStudents(true)
    setStudentId('')
    getClassStudents(currentClassId)
      .then((data) => setStudents(data.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false))
  }, [currentClassId])

  useEffect(() => {
    if (!subjectId || !currentClassId) {
      setTopics([])
      setLessonTopicId('')
      return
    }
    setLessonTopicId('')
    setLoadingTopics(true)
    getLessonTopics(Number(subjectId), currentClassId)
      .then((data) => setTopics(data.lesson_topics || []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false))
  }, [subjectId, currentClassId])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!currentClassId) return setError(t('teacher.selectClassFirst'))
    if (!subjectId) return setError(t('teacher.selectSubject'))
    if (!studentId) return setError(t('teacher.selectStudent'))
    if (!grade.trim()) return setError(t('student.grade') + ' required')
    if (!date.trim()) return setError(t('teacher.date') + ' required')
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
      setSuccess(t('teacher.recordGrade') + ' – OK')
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

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">{t('mainTeacher.gradesTitle')}</div>
        <div className="text-sm text-slate-600">Record grades for the class selected on the Dashboard.</div>
      </div>

      {!currentClassId && (
        <Alert kind="warning">
          Select a class on the <Link to="/teacher/dashboard" className="underline font-medium">Dashboard</Link> first.
        </Alert>
      )}

      <Card title="Add Grade">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          {error ? <div className="md:col-span-2"><Alert kind="error">{error}</Alert></div> : null}
          {success ? <div className="md:col-span-2"><Alert kind="success">{success}</Alert></div> : null}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('teacher.selectSubject')}</label>
            {!loadingCatalog && subjects.length === 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {t('teacher.noSubjectsAssigned')}
              </p>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => { setSubjectId(e.target.value); setLessonTopicId('') }}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                required
                disabled={!currentClassId || subjects.length === 0}
              >
                <option value="">{t('teacher.selectSubject')}</option>
                {subjects.map((s) => (
                  <option key={s.id} value={String(s.id)}>{subjectLabel(t, s.name)}</option>
                ))}
              </select>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('teacher.topic')}</label>
            <select
              value={lessonTopicId}
              onChange={(e) => setLessonTopicId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              disabled={!subjectId || !currentClassId || loadingTopics}
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
              disabled={!currentClassId || loadingStudents}
            >
              <option value="">{loadingStudents ? t('common.loading') : !currentClassId ? t('teacher.selectClassFirst') : t('teacher.selectStudent')}</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.user.name}</option>
              ))}
            </select>
          </div>
          <Input label={t('student.grade')} type="number" min={0} max={100} value={grade} onChange={(e) => setGrade(e.target.value)} required />
          <Input label={t('teacher.date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting || loadingCatalog || !currentClassId}>
              {submitting ? 'Saving…' : t('teacher.recordGrade')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
