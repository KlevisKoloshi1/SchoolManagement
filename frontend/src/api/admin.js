import { apiClient } from './axios'

export async function getTeachers() {
  const { data } = await apiClient.get('/admin/teachers')
  return data
}

/**
 * @param {{ available_for_main_teacher?: boolean }} [params] - If true, returns only classes without a main teacher (for add main teacher form).
 */
export async function getClasses(params) {
  const { data } = await apiClient.get('/admin/classes', { params: params ?? {} })
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

export async function getActivities() {
  const { data } = await apiClient.get('/admin/activities')
  return data
}

export async function createActivity({ name, date, description, for_all_classes, class_ids }) {
  const { data } = await apiClient.post('/admin/activities', {
    name,
    date,
    description: description || null,
    for_all_classes: !!for_all_classes,
    class_ids: for_all_classes ? [] : (class_ids || []),
  })
  return data
}

export async function updateActivity(id, { name, date, description, for_all_classes, class_ids }) {
  const { data } = await apiClient.put(`/admin/activities/${id}`, {
    name,
    date,
    description: description || null,
    for_all_classes: !!for_all_classes,
    class_ids: for_all_classes ? [] : (class_ids || []),
  })
  return data
}

export async function deleteActivity(id) {
  const { data } = await apiClient.delete(`/admin/activities/${id}`)
  return data
}

export async function getAnnouncements() {
  const { data } = await apiClient.get('/admin/announcements')
  return data
}

export async function createAnnouncement({ type, title, message, subject_id, for_all_classes, class_ids }) {
  const { data } = await apiClient.post('/admin/announcements', {
    type,
    title,
    message,
    subject_id: subject_id || null,
    for_all_classes: !!for_all_classes,
    class_ids: for_all_classes ? [] : (class_ids || []),
  })
  return data
}

export async function updateAnnouncement(id, { type, title, message, subject_id, for_all_classes, class_ids }) {
  const { data } = await apiClient.put(`/admin/announcements/${id}`, {
    type,
    title,
    message,
    subject_id: subject_id || null,
    for_all_classes: !!for_all_classes,
    class_ids: for_all_classes ? [] : (class_ids || []),
  })
  return data
}

export async function deleteAnnouncement(id) {
  const { data } = await apiClient.delete(`/admin/announcements/${id}`)
  return data
}

