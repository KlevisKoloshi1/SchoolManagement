import { apiClient } from './axios'

export async function createTeacher({ name, email, is_main_teacher }) {
  const { data } = await apiClient.post('/admin/teachers', {
    name,
    email,
    is_main_teacher,
  })
  return data
}

export async function assignClass({ teacher_id, class_id }) {
  const { data } = await apiClient.post('/admin/assign-class', {
    teacher_id,
    class_id,
  })
  return data
}

export async function assignSubject({ teacher_id, subject_id }) {
  const { data } = await apiClient.post('/admin/assign-subject', {
    teacher_id,
    subject_id,
  })
  return data
}

