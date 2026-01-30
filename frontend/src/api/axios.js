import axios from 'axios'

let inMemoryToken = null
let onUnauthorized = null

export function setAuthToken(token) {
  inMemoryToken = token || null
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = typeof handler === 'function' ? handler : null
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = inMemoryToken
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401 && onUnauthorized) {
      onUnauthorized()
    }
    return Promise.reject(error)
  },
)

