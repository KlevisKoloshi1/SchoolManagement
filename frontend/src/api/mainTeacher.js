import { apiClient } from './axios'

export async function getStudents(classId = null) {
  const params = classId != null ? { class_id: classId } : {}
  const { data } = await apiClient.get('/main-teacher/students', { params })
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

export async function getLessonTopics(subjectId, classId) {
  const params = {}
  if (subjectId != null) params.subject_id = subjectId
  if (classId != null) params.class_id = classId
  const { data } = await apiClient.get('/main-teacher/lesson-topics', { params })
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

export async function addAbsence({ student_id, subject_id, lesson_topic_id, date, justified }) {
  const body = { student_id, subject_id, date, justified: justified ?? false }
  if (lesson_topic_id != null) body.lesson_topic_id = lesson_topic_id
  const { data } = await apiClient.post('/main-teacher/absences', body)
  return data
}

export async function addGrade({ student_id, subject_id, lesson_topic_id, grade, date, notes }) {
  const body = { student_id, subject_id, grade: Number(grade), date }
  if (lesson_topic_id != null) body.lesson_topic_id = lesson_topic_id
  const { data } = await apiClient.post('/main-teacher/grades', body)
  return data
}

export async function deleteStudent(studentId) {
  const { data } = await apiClient.delete(`/main-teacher/students/${studentId}`)
  return data
}

export async function getActivities(classId = null) {
  const params = classId != null ? { class_id: classId } : {}
  const { data } = await apiClient.get('/main-teacher/activities', { params })
  return data
}

export async function getAnnouncements(classId = null) {
  const params = classId != null ? { class_id: classId } : {}
  const { data } = await apiClient.get('/main-teacher/announcements', { params })
  return data
}

export async function getCalendar(from, to, classId = null) {
  const params = {}
  if (from) params.from = from
  if (to) params.to = to
  if (classId != null) params.class_id = classId
  const { data } = await apiClient.get('/main-teacher/calendar', { params })
  return data
}

