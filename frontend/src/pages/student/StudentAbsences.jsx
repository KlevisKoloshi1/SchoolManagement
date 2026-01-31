import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAbsences } from '../../api/student'
import { Alert, Card, Spinner, Badge } from '../../components/ui'

function subjectLabel(t, name) {
  if (!name) return '—'
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

export default function StudentAbsences() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [absences, setAbsences] = useState([])

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAbsences()
        if (!mounted) return
        setAbsences(Array.isArray(data) ? data : data?.data || [])
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.message || 'Failed to load absences.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {t('student.absencesTitle')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          {t('student.absencesDescription')}
        </div>
      </div>

      <Card title={t('student.absencesTitle')} className="max-w-6xl">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-8 text-text-secondary">
            <Spinner size={20} />
            <span>{t('common.loading')}</span>
          </div>
        )}
        
        {error && <Alert kind="error">{error}</Alert>}
        
        {!loading && !error && absences.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">◐</div>
            <div className="text-lg font-medium text-text-primary mb-2">
              {t('student.noAbsences')}
            </div>
            <div className="text-text-secondary">
              {t('student.perfectAttendance')}
            </div>
          </div>
        )}

        {!loading && !error && absences.length > 0 && (
          <div className="space-y-4">
            {/* Mobile view */}
            <div className="block md:hidden space-y-3">
              {absences.map((absence, idx) => (
                <div key={absence.id || idx} className="p-4 rounded-xl bg-surface-hover border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-text-primary">
                      {absence.subject ? subjectLabel(t, absence.subject.name) : '—'}
                    </div>
                    <Badge variant={absence.justified ? 'success' : 'warning'}>
                      {absence.justified ? t('common.yes') : t('common.no')}
                    </Badge>
                  </div>
                  <div className="text-sm text-text-secondary space-y-1">
                    <div><strong>{t('student.date')}:</strong> {absence.date || '—'}</div>
                    <div><strong>{t('student.topic')}:</strong> {absence.topic?.title ?? '—'}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead className="bg-surface-hover">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t('student.date')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t('student.subject')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t('student.topic')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t('student.justified')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {absences.map((absence, idx) => (
                    <tr key={absence.id || idx} className="hover:bg-surface-hover transition-colors">
                      <td className="px-6 py-4 text-sm text-text-primary font-medium">
                        {absence.date || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {absence.subject ? subjectLabel(t, absence.subject.name) : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {absence.topic?.title ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={absence.justified ? 'success' : 'warning'}>
                          {absence.justified ? t('common.yes') : t('common.no')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
