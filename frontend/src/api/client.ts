import axios from 'axios'

type ValidationErrorDetail = {
  loc?: Array<string | number>
  msg?: string
}

const formatErrorDetail = (detail: unknown): string | undefined => {
  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return undefined
        }

        const validationError = item as ValidationErrorDetail
        if (!validationError.msg) {
          return undefined
        }

        const field = validationError.loc
          ?.filter((part) => part !== 'body')
          .map(String)
          .pop()
          ?.replaceAll('_', ' ')

        return field
          ? `${field.charAt(0).toUpperCase()}${field.slice(1)}: ${validationError.msg}`
          : validationError.msg
      })
      .filter((message): message is string => Boolean(message))

    if (messages.length > 0) {
      return messages.length === 1
        ? messages[0]
        : `Please correct the following:\n${messages.map((message) => `• ${message}`).join('\n')}`
    }
  }

  return undefined
}

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
    const message =
      formatErrorDetail(error.response?.data?.detail) ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  },
)

export default apiClient
