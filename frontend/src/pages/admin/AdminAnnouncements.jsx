import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getAnnouncements, createAnnouncement, deleteAnnouncement, getClasses, getSubjects } from '../../api/admin'
import { Alert, Button, Card, ConfirmDialog, Input } from '../../components/ui'

export default function AdminAnnouncements() {
  const { t } = useTranslation()
  const [type, setType] = useState('cancelled')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [forAllClasses, setForAllClasses] = useState(false)
  const [classIds, setClassIds] = useState([])

  const [announcements, setAnnouncements] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, title } when delete modal is open

  useEffect(() => {
    fetchAnnouncements()
    getClasses().then((d) => setClasses(d.classes || [])).catch(() => setClasses([]))
    getSubjects().then((d) => setSubjects(d.subjects || [])).catch(() => setSubjects([]))
  }, [])

  async function fetchAnnouncements() {
    try {
      setLoading(true)
      setFetchError(null)
      const data = await getAnnouncements()
      setAnnouncements(data.announcements || [])
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Failed to load announcements.')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!title.trim()) return setError(t('notifications.announcementTitleRequired'))
    if (!message.trim()) return setError(t('notifications.announcementMessageRequired'))
    if (!forAllClasses && !classIds?.length) return setError(t('notifications.selectAtLeastOneClass'))

    setSubmitting(true)
    try {
      await createAnnouncement({
        type,
        title: title.trim(),
        message: message.trim(),
        subject_id: subjectId ? Number(subjectId) : null,
        for_all_classes: forAllClasses,
        class_ids: forAllClasses ? [] : classIds.map(Number),
      })
      setSuccess(t('notifications.announcementCreated'))
      setTitle('')
      setMessage('')
      setSubjectId('')
      setClassIds([])
      await fetchAnnouncements()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create announcement.')
    } finally {
      setSubmitting(false)
    }
  }

  function openDeleteModal(id, title) {
    setDeleteTarget({ id, title })
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const { id } = deleteTarget
    setDeletingId(id)
    try {
      await deleteAnnouncement(id)
      setFetchError(null)
      setDeleteTarget(null)
      await fetchAnnouncements()
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
          {t('navigation.announcements')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          {t('admin.announcementsDescription')}
        </div>
      </div>

      <Card title={t('notifications.addAnnouncement')}>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <Alert kind="error">{error}</Alert>}
          {success && <Alert kind="success">{success}</Alert>}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">{t('notifications.type')}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
            >
              <option value="cancelled">{t('notifications.typeCancelled')}</option>
              <option value="postponed">{t('notifications.typePostponed')}</option>
            </select>
          </div>
          <Input
            label={t('notifications.announcementTitle')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('notifications.announcementTitlePlaceholder')}
            required
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">{t('notifications.message')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              placeholder={t('notifications.messagePlaceholder')}
              required
            />
          </div>
          {subjects.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">{t('notifications.subjectOptional')}</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <option value="">—</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
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
            {submitting ? t('common.loading') : t('notifications.sendAnnouncement')}
          </Button>
        </form>
      </Card>

      <Card title={t('notifications.announcementsList')}>
        {fetchError && <Alert kind="error">{fetchError}</Alert>}
        {loading ? (
          <p className="text-text-secondary py-4">{t('common.loading')}</p>
        ) : announcements.length === 0 ? (
          <p className="text-text-secondary py-4">{t('notifications.noAnnouncements')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {announcements.map((a) => (
              <li key={a.id} className="py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-text-primary">{a.title}</div>
                  <div className="text-xs text-text-secondary capitalize">{a.type}</div>
                  <p className="text-sm text-text-secondary mt-1">{a.message}</p>
                  <div className="text-xs text-text-secondary mt-1">
                    {a.for_all_classes ? t('notifications.allClassrooms') : (a.classes?.map((c) => c.name).join(', ') || '')}
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openDeleteModal(a.id, a.title)}
                  disabled={deletingId === a.id}
                >
                  {deletingId === a.id ? t('common.loading') : t('common.delete')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('common.delete')}
        message={deleteTarget ? t('notifications.confirmDeleteAnnouncement', { name: deleteTarget.title }) : ''}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        confirmDisabled={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => !deletingId && setDeleteTarget(null)}
      />
    </div>
  )
}
