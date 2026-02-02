import { apiClient } from './axios'

export async function getSubjects() {
  const { data } = await apiClient.get('/teacher/subjects')
  return data
}

export async function getClasses() {
  const { data } = await apiClient.get('/teacher/classes')
  return data
}

export async function getClassStudents(classId) {
  const { data } = await apiClient.get(`/teacher/classes/${classId}/students`)
  return data
}

export async function getLessonTopics(subjectId, classId) {
  const params = {}
  if (subjectId != null) params.subject_id = subjectId
  if (classId != null) params.class_id = classId
  const { data } = await apiClient.get('/teacher/lesson-topics', { params })
  return data
}

export async function addLessonTopic({ subject_id, class_id, title, description, date }) {
  const body = { subject_id, class_id, title, date }
  if (description) body.description = description
  const { data } = await apiClient.post('/teacher/lesson-topics', body)
  return data
}

export async function addAbsence({ student_id, subject_id, lesson_topic_id, date, justified }) {
  const body = { student_id, subject_id, date, justified: justified ?? false }
  if (lesson_topic_id != null) body.lesson_topic_id = lesson_topic_id
  const { data } = await apiClient.post('/teacher/absences', body)
  return data
}

export async function addGrade({ student_id, subject_id, lesson_topic_id, grade, date }) {
  const body = { student_id, subject_id, grade: Number(grade), date }
  if (lesson_topic_id != null) body.lesson_topic_id = lesson_topic_id
  const { data } = await apiClient.post('/teacher/grades', body)
  return data
}

/**
 * Get performance report for a student.
 * @param {{ student_id: number, year?: number, semester?: number }} params
 */
export async function getPerformanceReport({ student_id, year, semester }) {
  const params = { student_id }
  if (year != null) params.year = year
  if (semester != null) params.semester = semester
  const { data } = await apiClient.get('/teacher/performance-report', { params })
  return data
}/**
 * Export performance report as PDF (returns blob for download/open).
 * @param {{ student_id: number, year?: number, semester?: number }} params
 */
export async function exportPerformanceReportPdf({ student_id, year, semester }) {
  const query = { student_id }
  if (year != null) query.year = year
  if (semester != null) query.semester = semester
  const { data } = await apiClient.get('/teacher/performance-report/export', {
    params: query,
    responseType: 'blob',
  })
  return data
}
