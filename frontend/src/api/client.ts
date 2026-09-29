import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional response interceptor for unified error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface backend error detail if present
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  },
)

export default apiClient
