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

export async function addLessonTopic({ subject_id, class_id, title, description, date }) {
  const body = { subject_id, class_id, title, date }
  if (description) body.description = description
  const { data } = await apiClient.post('/teacher/lesson-topics', body)
  return data
}

export async function addAbsence({ student_id, subject_id, date, justified }) {
  const { data } = await apiClient.post('/teacher/absences', {
    student_id,
    subject_id,
    date,
    justified: justified ?? false,
  })
  return data
}

export async function addGrade({ student_id, subject_id, grade, date }) {
  const { data } = await apiClient.post('/teacher/grades', {
    student_id,
    subject_id,
    grade: Number(grade),
    date,
  })
  return data
}

