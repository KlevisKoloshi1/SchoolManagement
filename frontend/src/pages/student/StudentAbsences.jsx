import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAbsences } from '../../api/student'
import { Alert, Card, Spinner } from '../../components/ui'

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
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">{t('student.absencesTitle')}</div>
        <div className="text-sm text-slate-600">{t('student.absencesDescription')}</div>
      </div>

      <Card title={t('student.absencesTitle')}>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Spinner /> {t('common.loading')}
          </div>
        ) : null}
        {error ? <Alert kind="error">{error}</Alert> : null}
        {!loading && !error && absences.length === 0 ? (
          <div className="text-sm text-slate-600">{t('student.noAbsences')}</div>
        ) : null}

        {!loading && !error && absences.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2">{t('student.date')}</th>
                  <th className="py-2">{t('student.subject')}</th>
                  <th className="py-2">{t('student.topic')}</th>
                  <th className="py-2">{t('student.justified')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {absences.map((a, idx) => (
                  <tr key={a.id || idx}>
                    <td className="py-2">{a.date || '—'}</td>
                    <td className="py-2">{a.subject ? subjectLabel(t, a.subject.name) : '—'}</td>
                    <td className="py-2">{a.topic?.title ?? '—'}</td>
                    <td className="py-2">{a.justified ? t('common.yes') : t('common.no')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
