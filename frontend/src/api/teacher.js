import { apiClient } from './axios'

export async function addLessonTopic({ subject_id, topic, taught_on }) {
  const { data } = await apiClient.post('/teacher/lesson-topics', {
    subject_id,
    topic,
    taught_on,
  })
  return data
}

export async function addAbsence({ student_id, absent_on, reason }) {
  const { data } = await apiClient.post('/teacher/absences', {
    student_id,
    absent_on,
    reason,
  })
  return data
}

export async function addGrade({ student_id, subject_id, grade, graded_on, notes }) {
  const { data } = await apiClient.post('/teacher/grades', {
    student_id,
    subject_id,
    grade,
    graded_on,
    notes,
  })
  return data
}

