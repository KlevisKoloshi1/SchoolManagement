import { apiClient } from './axios'

export async function getTeachers() {
  const { data } = await apiClient.get('/admin/teachers')
  return data
}

export async function getClasses() {
  const { data } = await apiClient.get('/admin/classes')
  return data
}

export async function getSubjects() {
  const { data } = await apiClient.get('/admin/subjects')
  return data
}

export async function getMainTeacherClassDetails(teacherId) {
  const { data } = await apiClient.get(`/admin/teachers/${teacherId}/class-details`)
  return data
}

export async function createTeacher({ name, email, is_main_teacher, class_id, subject_id, subject_ids }) {
  const body = { name, email, is_main_teacher }
  if (is_main_teacher) {
    body.class_id = class_id
    body.subject_id = subject_id
  } else if (subject_ids?.length) {
    body.subject_ids = subject_ids
  }
  const { data } = await apiClient.post('/admin/teachers', body)
  return data
}

export async function deleteTeacher(teacherId) {
  const { data } = await apiClient.delete(`/admin/teachers/${teacherId}`)
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

