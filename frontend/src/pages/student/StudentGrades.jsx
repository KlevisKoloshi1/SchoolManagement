import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getGrades } from '../../api/student'
import { Alert, Card, Spinner } from '../../components/ui'

function subjectLabel(t, name) {
  if (!name) return '—'
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

export default function StudentGrades() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [grades, setGrades] = useState([])

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await getGrades()
        if (!mounted) return
        setGrades(Array.isArray(data) ? data : data?.data || [])
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.message || 'Failed to load grades.')
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
        <div className="text-2xl font-semibold text-slate-900">{t('student.gradesTitle')}</div>
        <div className="text-sm text-slate-600">{t('student.gradesDescription')}</div>
      </div>

      <Card title={t('student.gradesTitle')}>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Spinner /> {t('common.loading')}
          </div>
        ) : null}
        {error ? <Alert kind="error">{error}</Alert> : null}
        {!loading && !error && grades.length === 0 ? (
          <div className="text-sm text-slate-600">{t('student.noGrades')}</div>
        ) : null}

        {!loading && !error && grades.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2">{t('student.subject')}</th>
                  <th className="py-2">{t('student.topic')}</th>
                  <th className="py-2">{t('student.grade')}</th>
                  <th className="py-2">{t('student.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((g, idx) => (
                  <tr key={g.id || idx}>
                    <td className="py-2">{g.subject ? subjectLabel(t, g.subject.name) : '—'}</td>
                    <td className="py-2">{g.topic?.title ?? '—'}</td>
                    <td className="py-2">{g.grade ?? '—'}</td>
                    <td className="py-2">{g.date ?? '—'}</td>
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
