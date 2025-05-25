import axios from "axios"
import { API_URL, DEFAULT_HEADERS } from "./api-config"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests - check both localStorage and sessionStorage
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({ message: "Network error. Please check your connection." })
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem("auth_token")
      sessionStorage.removeItem("auth_token")
      delete api.defaults.headers.common["Authorization"]
      
      // Redirect to login if not already there
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api

