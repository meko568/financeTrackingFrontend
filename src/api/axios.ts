import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://financetrackingbackend-main-76jdsf.free.laravel.cloud/api',
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('financeToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('financeToken')
      localStorage.removeItem('financeUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
