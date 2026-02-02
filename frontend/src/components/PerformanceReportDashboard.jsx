import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Card, Button, Spinner, Alert } from './ui'

function subjectLabel(t, name) {
  if (!name) return '—'
  const key = 'subjects.' + name
  const val = t(key)
  return val === key ? name : val
}

export default function PerformanceReportDashboard({
  report,
  loading,
  error,
  onExportPdf,
  exportPdfLoading = false,
  showExportButton = true,
}) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-12 text-text-secondary">
        <Spinner size={24} />
        <span>{t('reports.loadingReport')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert kind="error">
        {error}
      </Alert>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-12 text-text-secondary">
        {t('reports.noData')}
      </div>
    )
  }

  const { grades_by_subject = [], overall_average, total_absences = 0, grade_progress = [], absences_by_subject = [] } = report
  const hasData = grades_by_subject.length > 0 || grade_progress.length > 0 || absences_by_subject.length > 0

  if (!hasData) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">◒</div>
          <div className="text-lg font-medium text-text-primary mb-2">
            {t('reports.noGradesOrAbsences')}
          </div>
          <div className="text-text-secondary">{t('reports.noData')}</div>
        </div>
        {showExportButton && onExportPdf && (
          <div className="flex justify-center">
            <Button onClick={onExportPdf} disabled={exportPdfLoading}>
              {exportPdfLoading ? <Spinner size={16} /> : null}
              {t('reports.exportPdf')}
            </Button>
          </div>
        )}
      </div>
    )
  }

  const barData = grades_by_subject.map((row) => ({
    name: subjectLabel(t, row.subject_name),
    average: row.average ?? 0,
    fullMark: 100,
  }))

  const lineData = grade_progress.map((p) => ({
    date: p.date,
    grade: p.grade,
    subject: subjectLabel(t, p.subject_name),
  }))

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-border bg-surface">
          <div className="p-4">
            <div className="text-sm font-medium text-text-secondary mb-1">
              {t('reports.overallAverage')}
            </div>
            <div className="text-3xl font-bold text-primary">
              {overall_average != null ? overall_average : '—'}
            </div>
          </div>
        </Card>
        <Card className="border border-border bg-surface">
          <div className="p-4">
            <div className="text-sm font-medium text-text-secondary mb-1">
              {t('reports.totalAbsences')}
            </div>
            <div className="text-3xl font-bold text-text-primary">
              {total_absences}
            </div>
          </div>
        </Card>
      </div>

      {/* Line chart: grade progress over time */}
      {lineData.length > 0 && (
        <Card title={t('reports.gradeProgress')} className="overflow-hidden">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  formatter={(value) => [value, t('student.grade')]}
                  labelFormatter={(label, payload) => payload[0]?.payload?.subject ? `${payload[0].payload.subject} · ${label}` : label}
                />
                <Line
                  type="monotone"
                  dataKey="grade"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Bar chart: average per subject */}
      {barData.length > 0 && (
        <Card title={t('reports.averagePerSubject')} className="overflow-hidden">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  formatter={(value) => [value, t('reports.overallAverage')]}
                />
                <Bar dataKey="average" fill="#0ea5e9" radius={[0, 4, 4, 0]} name={t('reports.overallAverage')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {showExportButton && onExportPdf && (
        <div className="flex justify-end">
          <Button onClick={onExportPdf} disabled={exportPdfLoading} variant="secondary">
            {exportPdfLoading ? <Spinner size={16} className="mr-2" /> : null}
            {t('reports.exportPdf')}
          </Button>
        </div>
      )}
    </div>
  )
}

export { subjectLabel }
