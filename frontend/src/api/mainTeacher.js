import { apiClient } from './axios'

export async function getStudents() {
  const { data } = await apiClient.get('/main-teacher/students')
  return data
}

export async function getSubjects() {
  const { data } = await apiClient.get('/main-teacher/subjects')
  return data
}

export async function getClasses() {
  const { data } = await apiClient.get('/main-teacher/classes')
  return data
}

export async function addStudent({ name, email }) {
  const { data } = await apiClient.post('/main-teacher/students', {
    name,
    email,
  })
  return data
}

export async function addLessonTopic({ subject_id, class_id, title, description, date }) {
  const body = { subject_id, title, date }
  if (description) body.description = description
  if (class_id) body.class_id = class_id
  const { data } = await apiClient.post('/main-teacher/lesson-topics', body)
  return data
}

export async function addAbsence({ student_id, subject_id, date, justified }) {
  const { data } = await apiClient.post('/main-teacher/absences', {
    student_id,
    subject_id,
    date,
    justified: justified ?? false,
  })
  return data
}

export async function addGrade({ student_id, subject_id, grade, date, notes }) {
  const { data } = await apiClient.post('/main-teacher/grades', {
    student_id,
    subject_id,
    grade: Number(grade),
    date,
  })
  return data
}

