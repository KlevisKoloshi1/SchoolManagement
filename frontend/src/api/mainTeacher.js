import { apiClient } from './axios'

export async function addStudent({ name, email, class_id }) {
  const { data } = await apiClient.post('/main-teacher/students', {
    name,
    email,
    class_id,
  })
  return data
}

export async function addLessonTopic({ subject_id, class_id, topic, taught_on }) {
  const { data } = await apiClient.post('/main-teacher/lesson-topics', {
    subject_id,
    class_id,
    topic,
    taught_on,
  })
  return data
}

export async function addAbsence({ student_id, absent_on, reason }) {
  const { data } = await apiClient.post('/main-teacher/absences', {
    student_id,
    absent_on,
    reason,
  })
  return data
}

export async function addGrade({ student_id, subject_id, grade, graded_on, notes }) {
  const { data } = await apiClient.post('/main-teacher/grades', {
    student_id,
    subject_id,
    grade,
    graded_on,
    notes,
  })
  return data
}

