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

