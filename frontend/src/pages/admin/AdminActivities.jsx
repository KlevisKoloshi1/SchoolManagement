import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getActivities, createActivity, deleteActivity, getClasses } from '../../api/admin'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function AdminActivities() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [forAllClasses, setForAllClasses] = useState(false)
  const [classIds, setClassIds] = useState([])

  const [activities, setActivities] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchActivities()
    getClasses().then((d) => setClasses(d.classes || [])).catch(() => setClasses([]))
  }, [])

  async function fetchActivities() {
    try {
      setLoading(true)
      setFetchError(null)
      const data = await getActivities()
      setActivities(data.activities || [])
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Failed to load activities.')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!name.trim()) return setError(t('notifications.activityNameRequired'))
    if (!date.trim()) return setError(t('notifications.activityDateRequired'))
    if (!forAllClasses && !classIds?.length) return setError(t('notifications.selectAtLeastOneClass'))

    setSubmitting(true)
    try {
      await createActivity({
        name: name.trim(),
        date,
        description: description.trim() || null,
        for_all_classes: forAllClasses,
        class_ids: forAllClasses ? [] : classIds.map(Number),
      })
      setSuccess(t('notifications.activityCreated'))
      setName('')
      setDate('')
      setDescription('')
      setClassIds([])
      await fetchActivities()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create activity.')
    } finally {
      setSubmitting(false)
    }
  }

  async function onDelete(id, activityName) {
    if (!confirm(t('notifications.confirmDeleteActivity', { name: activityName }))) return
    setDeletingId(id)
    try {
      await deleteActivity(id)
      await fetchActivities()
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Failed to delete.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {t('navigation.activities')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          {t('admin.activitiesDescription')}
        </div>
      </div>

      <Card title={t('notifications.addActivity')}>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <Alert kind="error">{error}</Alert>}
          {success && <Alert kind="success">{success}</Alert>}
          <Input
            label={t('notifications.activityName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('notifications.activityNamePlaceholder')}
            required
          />
          <Input
            label={t('notifications.activityDate')}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">{t('notifications.description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              placeholder={t('notifications.descriptionPlaceholder')}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={forAllClasses}
              onChange={(e) => { setForAllClasses(e.target.checked); if (e.target.checked) setClassIds([]) }}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm font-medium text-text-primary">{t('notifications.allClassrooms')}</span>
          </label>
          {!forAllClasses && classes.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">{t('notifications.selectClassrooms')}</label>
              <div className="flex flex-wrap gap-2 border border-border rounded-xl p-3 bg-surface">
                {classes.map((c) => (
                  <label key={c.id} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={classIds.includes(c.id)}
                      onChange={(e) => {
                        if (e.target.checked) setClassIds((prev) => [...prev, c.id])
                        else setClassIds((prev) => prev.filter((id) => id !== c.id))
                      }}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className="text-sm text-text-primary">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? t('common.loading') : t('notifications.createActivity')}
          </Button>
        </form>
      </Card>

      <Card title={t('notifications.activitiesList')}>
        {fetchError && <Alert kind="error">{fetchError}</Alert>}
        {loading ? (
          <p className="text-text-secondary py-4">{t('common.loading')}</p>
        ) : activities.length === 0 ? (
          <p className="text-text-secondary py-4">{t('notifications.noActivities')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {activities.map((a) => (
              <li key={a.id} className="py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-text-primary">{a.name}</div>
                  <div className="text-sm text-text-secondary">{a.date}</div>
                  {a.description && <p className="text-sm text-text-secondary mt-1">{a.description}</p>}
                  <div className="text-xs text-text-secondary mt-1">
                    {a.for_all_classes ? t('notifications.allClassrooms') : (a.classes?.map((c) => c.name).join(', ') || '')}
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(a.id, a.name)}
                  disabled={deletingId === a.id}
                >
                  {deletingId === a.id ? t('common.loading') : t('common.delete')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
