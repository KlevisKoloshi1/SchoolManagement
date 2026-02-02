import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getPerformanceReport, exportPerformanceReportPdf } from '../../api/student'
import PerformanceReportDashboard from '../../components/PerformanceReportDashboard'
import { Card, Select } from '../../components/ui'

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i)

export default function StudentReports() {
  const { t } = useTranslation()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const [exportLoading, setExportLoading] = useState(false)

  const yearNum = year ? Number(year) : null
  const semesterNum = semester ? Number(semester) : null

  const loadReport = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (yearNum != null) params.year = yearNum
      if (semesterNum != null) params.semester = semesterNum
      const data = await getPerformanceReport(params)
      setReport(data)
    } catch (err) {
      setError(err?.response?.data?.message || t('reports.failedToLoadReport'))
      setReport(null)
    } finally {
      setLoading(false)
    }
  }, [yearNum, semesterNum, t])

  useEffect(() => {
    let mounted = true
    loadReport().then(() => { if (!mounted) return })
    return () => { mounted = false }
  }, [loadReport])

  const handleExportPdf = async () => {
    setExportLoading(true)
    try {
      const params = {}
      if (yearNum != null) params.year = yearNum
      if (semesterNum != null) params.semester = semesterNum
      const blob = await exportPerformanceReportPdf(params)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `performance-report-${report?.student?.name ?? 'report'}-${new Date().toISOString().slice(0, 10)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to export PDF.')
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {t('student.reportsTitle')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          {t('student.reportsDescription')}
        </div>
      </div>

      <Card title={t('reports.performanceReport')} className="max-w-6xl">
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            label={t('reports.academicYear')}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={[{ value: '', label: t('reports.allTime') }, ...YEARS.map((y) => ({ value: String(y), label: String(y) }))]}
          />
          <Select
            label={t('reports.semester')}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            options={[
              { value: '', label: '—' },
              { value: '1', label: t('reports.semester1') },
              { value: '2', label: t('reports.semester2') },
              { value: '3', label: t('reports.semester3') },
            ]}
          />
        </div>

        <PerformanceReportDashboard
          report={report}
          loading={loading}
          error={error}
          onExportPdf={handleExportPdf}
          exportPdfLoading={exportLoading}
          showExportButton={true}
        />
      </Card>
    </div>
  )
}
