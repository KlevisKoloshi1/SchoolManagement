import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getGrades } from '../../api/student'
import { Alert, Card, Spinner, Badge } from '../../components/ui'

function subjectLabel(t, name) {
  if (!name) return '—'
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

function getGradeBadgeVariant(grade) {
  if (!grade) return 'default'
  const numGrade = parseFloat(grade)
  if (numGrade >= 9) return 'success'
  if (numGrade >= 7) return 'warning'
  return 'error'
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
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {t('student.gradesTitle')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          {t('student.gradesDescription')}
        </div>
      </div>

      <Card title={t('student.gradesTitle')} className="max-w-6xl">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-8 text-text-secondary">
            <Spinner size={20} />
            <span>{t('common.loading')}</span>
          </div>
        )}
        
        {error && <Alert kind="error">{error}</Alert>}
        
        {!loading && !error && grades.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">◗</div>
            <div className="text-lg font-medium text-text-primary mb-2">
              {t('student.noGrades')}
            </div>
            <div className="text-text-secondary">
              {t('student.noGradesRecorded')}
            </div>
          </div>
        )}

        {!loading && !error && grades.length > 0 && (
          <div className="space-y-4">
            {/* Mobile view */}
            <div className="block md:hidden space-y-3">
              {grades.map((grade, idx) => (
                <div key={grade.id || idx} className="p-4 rounded-xl bg-surface-hover border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-text-primary">
                      {grade.subject ? subjectLabel(t, grade.subject.name) : '—'}
                    </div>
                    <Badge variant={getGradeBadgeVariant(grade.grade)} className="text-lg font-bold">
                      {grade.grade ?? '—'}
                    </Badge>
                  </div>
                  <div className="text-sm text-text-secondary space-y-1">
                    <div><strong>{t('student.topic')}:</strong> {grade.topic?.title ?? '—'}</div>
                    <div><strong>{t('student.date')}:</strong> {grade.date ?? '—'}</div>
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
                      {t('student.subject')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t('student.topic')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t('student.grade')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t('student.date')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {grades.map((grade, idx) => (
                    <tr key={grade.id || idx} className="hover:bg-surface-hover transition-colors">
                      <td className="px-6 py-4 text-sm text-text-primary font-medium">
                        {grade.subject ? subjectLabel(t, grade.subject.name) : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {grade.topic?.title ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getGradeBadgeVariant(grade.grade)} className="text-base font-bold">
                          {grade.grade ?? '—'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {grade.date ?? '—'}
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
