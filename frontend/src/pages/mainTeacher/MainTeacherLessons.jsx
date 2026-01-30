import { useState } from 'react'
import { addLessonTopic } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function MainTeacherLessons() {
  const [subjectId, setSubjectId] = useState('')
  const [classId, setClassId] = useState('')
  const [topic, setTopic] = useState('')
  const [taughtOn, setTaughtOn] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!subjectId.trim()) return setError('Subject ID is required.')
    if (!classId.trim()) return setError('Class ID is required.')
    if (!topic.trim()) return setError('Topic is required.')
    if (!taughtOn.trim()) return setError('Date is required.')

    setSubmitting(true)
    try {
      const data = await addLessonTopic({
        subject_id: Number(subjectId),
        class_id: Number(classId),
        topic,
        taught_on: taughtOn,
      })
      setSuccess(data?.message || 'Lesson topic added.')
      setSubjectId('')
      setClassId('')
      setTopic('')
      setTaughtOn('')
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
        <div className="text-sm text-slate-600">Add lesson topics for your class.</div>
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

          <Input label="Subject ID" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} />
          <Input label="Class ID" value={classId} onChange={(e) => setClassId(e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <Input label="Taught on" type="date" value={taughtOn} onChange={(e) => setTaughtOn(e.target.value)} />
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Add topic'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

