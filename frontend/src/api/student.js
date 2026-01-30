import { apiClient } from './axios'

export async function getGrades() {
  const { data } = await apiClient.get('/student/grades')
  return data
}

export async function getAbsences() {
  const { data } = await apiClient.get('/student/absences')
  return data
}

