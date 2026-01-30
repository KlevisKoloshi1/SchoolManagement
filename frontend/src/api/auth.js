import { apiClient } from './axios'

export async function login({ login, password }) {
  const { data } = await apiClient.post('/login', { login, password })
  return data // { token, user }
}

export async function logout() {
  const { data } = await apiClient.post('/logout')
  return data
}

