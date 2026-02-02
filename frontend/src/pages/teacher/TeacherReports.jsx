import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getClasses, getClassStudents, getPerformanceReport, exportPerformanceReportPdf } from '../../api/teacher'
import PerformanceReportDashboard from '../../components/PerformanceReportDashboard'
import { Card, Select } from '../../components/ui'

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i)

export default function TeacherReports() {
  const { t } = useTranslation()
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [classId, setClassId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const [report, setReport] = useState(null)
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingReport, setLoadingReport] = useState(false)
  const [error, setError] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    getClasses().then((data) => setClasses(data.classes || [])).catch(() => setClasses([])).finally(() => setLoadingCatalog(false))
  }, [])

  useEffect(() => {
    if (!classId) {
      setStudents([])
      setStudentId('')
      setReport(null)
      return
    }
    setStudentId('')
    setReport(null)
    getClassStudents(Number(classId)).then((data) => setStudents(data.students || [])).catch(() => setStudents([]))
  }, [classId])

  const loadReport = useCallback(async () => {
    if (!studentId) return
    setLoadingReport(true)
    setError(null)
    try {
      const params = { student_id: Number(studentId) }
      if (year) params.year = Number(year)
      if (semester) params.semester = Number(semester)
      const data = await getPerformanceReport(params)
      setReport(data)
    } catch (err) {
      setError(err?.response?.data?.message || t('reports.failedToLoadReport'))
      setReport(null)
    } finally {
      setLoadingReport(false)
    }
  }, [studentId, year, semester, t])

  useEffect(() => {
    if (!studentId) { setReport(null); return }
    loadReport()
  }, [studentId, loadReport])

  const handleExportPdf = async () => {
    if (!studentId) return
    setExportLoading(true)
    try {
      const params = { student_id: Number(studentId) }
      if (year) params.year = Number(year)
      if (semester) params.semester = Number(semester)
      const blob = await exportPerformanceReportPdf(params)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'performance-report-' + (report?.student?.name ?? 'report') + '-' + new Date().toISOString().slice(0, 10) + '.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to export PDF.')
    } finally {
      setExportLoading(false)
    }
  }

  const studentOptions = students.map((s) => ({ value: String(s.id), label: s.user?.name ?? 'Student ' + s.id }))
  const classOpts = [{ value: '', label: t('reports.selectClassFirst') }, ...classes.map((c) => ({ value: String(c.id), label: c.name }))]
  const studentOpts = [{ value: '', label: t('reports.selectStudentFirst') }, ...studentOptions]
  const yearOpts = [{ value: '', label: t('reports.allTime') }, ...YEARS.map((y) => ({ value: String(y), label: String(y) }))]
  const semOpts = [{ value: '', label: '—' }, { value: '1', label: t('reports.semester1') }, { value: '2', label: t('reports.semester2') }, { value: '3', label: t('reports.semester3') }]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">{t('reports.title')}</div>
        <div className="text-text-secondary max-w-2xl">{t('reports.performanceReport')} — {t('teacher.selectClass')} → {t('reports.selectStudent')}</div>
      </div>
      <Card title={t('reports.performanceReport')} className="max-w-6xl">
        <div className="flex flex-wrap gap-4 mb-6">
          <Select label={t('reports.selectClass')} value={classId} onChange={(e) => setClassId(e.target.value)} options={classOpts} disabled={loadingCatalog} />
          <Select label={t('reports.selectStudent')} value={studentId} onChange={(e) => setStudentId(e.target.value)} options={studentOpts} disabled={!classId || students.length === 0} />
          <Select label={t('reports.academicYear')} value={year} onChange={(e) => setYear(e.target.value)} options={yearOpts} />
          <Select label={t('reports.semester')} value={semester} onChange={(e) => setSemester(e.target.value)} options={semOpts} />
        </div>
        {!studentId ? (
          <div className="text-center py-12 text-text-secondary">{classId ? t('reports.selectStudentFirst') : t('reports.selectClassFirst')}</div>
        ) : (
          <PerformanceReportDashboard report={report} loading={loadingReport} error={error} onExportPdf={handleExportPdf} exportPdfLoading={exportLoading} showExportButton={true} />
        )}
      </Card>
    </div>
  )
}
