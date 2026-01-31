import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getSubjects, getClassStudents, getLessonTopics, addAbsence } from '../../api/teacher'
import { useTeacherClass } from '../../contexts/TeacherClassContext'
import { Alert, Button, Card, Input, Select } from '../../components/ui'

function subjectLabel(t, name) {
  if (!name) return ''
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

export default function TeacherAbsences() {
  const { t } = useTranslation()
  const { currentClassId } = useTeacherClass()
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [topics, setTopics] = useState([])
  const [subjectId, setSubjectId] = useState('')
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
    if (!date.trim()) return setError(t('teacher.date') + ' ' + t('common.required'))

    setSubmitting(true)
    try {
      await addAbsence({
        student_id: Number(studentId),
        subject_id: Number(subjectId),
        lesson_topic_id: lessonTopicId ? Number(lessonTopicId) : undefined,
        date,
        justified,
      })
      setSuccess(t('teacher.recordAbsence') + ' – ' + t('common.success'))
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

  const subjectOptions = subjects.map(s => ({
    value: s.id,
    label: subjectLabel(t, s.name)
  }))

  const studentOptions = students.map(s => ({
    value: s.id,
    label: `${s.user.name} – ${s.user.email}`
  }))

  const topicOptions = topics.map(tpc => ({
    value: tpc.id,
    label: `${tpc.title} (${tpc.date})`
  }))

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {t('mainTeacher.absencesTitle')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          Record absences for the class selected on the Dashboard. Select subject, topic, then student.
        </div>
      </div>

      {!currentClassId && (
        <Alert kind="warning">
          Select a class on the <Link to="/teacher/dashboard" className="underline font-medium">Dashboard</Link> first.
        </Alert>
      )}

      <Card title={t('teacher.recordAbsence')} className="max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <Alert kind="error">{error}</Alert>
          )}
          {success && (
            <Alert kind="success">{success}</Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Select
              label={t('teacher.selectSubject')}
              value={subjectId}
              onChange={(e) => { 
                setSubjectId(e.target.value)
                setLessonTopicId('')
              }}
              options={subjectOptions}
              placeholder={t('teacher.selectSubject')}
              required
              disabled={!currentClassId}
            />

            <Select
              label={t('teacher.topic')}
              value={lessonTopicId}
              onChange={(e) => setLessonTopicId(e.target.value)}
              options={topicOptions}
              placeholder={t('teacher.selectTopic')}
              disabled={!subjectId || !currentClassId || loadingTopics}
            />

            <Select
              label={t('teacher.selectStudent')}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              options={studentOptions}
              placeholder={
                loadingStudents 
                  ? t('common.loading') 
                  : !currentClassId 
                    ? t('teacher.selectClassFirst') 
                    : t('teacher.selectStudent')
              }
              disabled={!currentClassId || loadingStudents}
              required
            />

            <Input 
              label={t('teacher.date')} 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />

            <div className="flex items-center gap-3 pt-8">
              <input 
                type="checkbox" 
                id="justified" 
                checked={justified} 
                onChange={(e) => setJustified(e.target.checked)} 
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20" 
              />
              <label htmlFor="justified" className="text-sm font-medium text-text-primary">
                {t('teacher.justified')}
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={submitting || loadingCatalog || !currentClassId}
              className="min-w-[140px]"
            >
              {submitting ? t('common.loading') : t('teacher.recordAbsence')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
