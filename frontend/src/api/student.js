import { apiClient } from './axios'

export async function getGrades() {
  const { data } = await apiClient.get('/student/grades')
  return data
}

export async function getAbsences() {
  const { data } = await apiClient.get('/student/absences')
  return data
}

export async function getActivities() {
  const { data } = await apiClient.get('/student/activities')
  return data
}

export async function getAnnouncements() {
  const { data } = await apiClient.get('/student/announcements')
  return data
}

export async function getCalendar(from, to) {
  const params = {}
  if (from) params.from = from
  if (to) params.to = to
  const { data } = await apiClient.get('/student/calendar', { params })
  return data
}

/**
 * Get current student's performance report.
 * @param {{ year?: number, semester?: number }} [params]
 */
export async function getPerformanceReport(params = {}) {
  const { data } = await apiClient.get('/student/performance-report', { params })
  return data
}/**
 * Export performance report as PDF (returns blob for download/open).
 * @param {{ year?: number, semester?: number }} [params]
 */
export async function exportPerformanceReportPdf(params = {}) {
  const { data } = await apiClient.get('/student/performance-report/export', {
    params,
    responseType: 'blob',
  })
  return data
}
