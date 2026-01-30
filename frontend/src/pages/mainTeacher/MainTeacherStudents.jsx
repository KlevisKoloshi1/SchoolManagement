import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getStudents, getClasses, addStudent, deleteStudent } from '../../api/mainTeacher'
import { Alert, Button, Card, Input } from '../../components/ui'

const STORAGE_CLASS_KEY = 'mainTeacher_currentClassId'

export default function MainTeacherStudents() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [classes, setClasses] = useState([])
  const [homeroomClass, setHomeroomClass] = useState(null)
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [currentClassId, setCurrentClassId] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_CLASS_KEY)
    return stored ? (Number(stored) || null) : null
  })
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [lastCredentials, setLastCredentials] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const isViewingHomeroom = currentClassId == null || (homeroomClass && currentClassId === homeroomClass.id)

  useEffect(() => {
    if (currentClassId != null) sessionStorage.setItem(STORAGE_CLASS_KEY, String(currentClassId))
    else sessionStorage.removeItem(STORAGE_CLASS_KEY)
  }, [currentClassId])

  useEffect(() => {
    fetchCatalogAndStudents()
  }, [currentClassId])

  async function fetchCatalogAndStudents() {
    try {
      setLoading(true)
      setFetchError(null)
      const [studentsRes, classesRes] = await Promise.all([
        getStudents(currentClassId ?? undefined),
        getClasses(),
      ])
      setHomeroomClass(studentsRes.homeroom_class || null)
      setClassInfo(studentsRes.class || null)
      setStudents(studentsRes.students || [])
      setClasses(classesRes.classes || [])
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Failed to load.')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLastCredentials(null)
    if (!name.trim()) return setError(t('mainTeacher.studentNameRequired'))

    setSubmitting(true)
    try {
      const data = await addStudent({ name: name.trim(), email: email.trim() || undefined })
      setSuccess(t('mainTeacher.studentAdded'))
      setLastCredentials(data.credentials ? { username: data.credentials.username, password: data.credentials.password } : null)
      setName('')
      setEmail('')
      if (isViewingHomeroom) await fetchCatalogAndStudents()
    } catch (err) {
      setError(err?.response?.data?.message || t('mainTeacher.failedToAddStudent'))
    } finally {
      setSubmitting(false)
    }
  }

  async function onDelete(studentId) {
    if (!window.confirm(t('mainTeacher.confirmDeleteStudent'))) return
    setDeletingId(studentId)
    setError(null)
    try {
      await deleteStudent(studentId)
      setSuccess(t('mainTeacher.studentDeleted'))
      if (isViewingHomeroom) await fetchCatalogAndStudents()
      else await fetchCatalogAndStudents()
    } catch (err) {
      setError(err?.response?.data?.message || t('mainTeacher.failedToDeleteStudent'))
    } finally {
      setDeletingId(null)
    }
  }

  function handleClassChange(e) {
    const val = e.target.value
    setCurrentClassId(val === '' ? null : Number(val))
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">{t('navigation.students')}</div>
        <div className="text-sm text-slate-600">{t('mainTeacher.studentsDescription')}</div>
      </div>

      {/* Class switcher: only show when we have homeroom and classes */}
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
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {!isViewingHomeroom && classInfo && (
              <span className="text-sm text-slate-500">
                {t('mainTeacher.viewingAsTeacher')} – {classInfo.name}
              </span>
            )}
          </div>
        </Card>
      )}

      {classInfo && (
        <p className="text-sm text-slate-700">
          {t('mainTeacher.yourClass')}: <strong>{classInfo.name}</strong>
        </p>
      )}

      {/* Add student: only in homeroom */}
      {isViewingHomeroom && (
        <Card title={t('mainTeacher.addStudent')}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            {error ? (
              <div className="md:col-span-2">
                <Alert kind="error">{error}</Alert>
              </div>
            ) : null}
            {success ? (
              <div className="md:col-span-2">
                <Alert kind="success">{success}</Alert>
                {lastCredentials && (
                  <div className="mt-2 rounded-md bg-slate-50 p-3 text-sm">
                    <div className="font-medium text-slate-700">{t('mainTeacher.generatedCredentials')}</div>
                    <div className="mt-1 font-mono text-slate-800">
                      {t('common.username')}: {lastCredentials.username} &nbsp; {t('common.password')}: {lastCredentials.password}
                    </div>
                    <div className="mt-1 text-slate-600">{t('mainTeacher.saveCredentials')}</div>
                  </div>
                )}
              </div>
            ) : null}
            <Input label={t('mainTeacher.fullName')} value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label={t('common.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('mainTeacher.emailOptional')} />
            <div className="md:col-span-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? t('mainTeacher.saving') : t('mainTeacher.addStudent')}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title={isViewingHomeroom ? t('mainTeacher.studentsInYourClass') : t('mainTeacher.studentsInClass')}>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-600">{t('common.loading')}</div>
        ) : fetchError ? (
          <Alert kind="error">{fetchError}</Alert>
        ) : students.length === 0 ? (
          <p className="py-4 text-slate-500">{t('mainTeacher.noStudents')}</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {students.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-slate-900">{s.user.name}</div>
                  <div className="text-sm text-slate-600">{s.user.email || '—'}</div>
                  <div className="text-xs font-mono text-slate-500">{s.user.username}</div>
                </div>
                {isViewingHomeroom && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="text-red-600 hover:bg-red-50"
                  >
                    {deletingId === s.id ? t('common.loading') : t('common.delete')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
