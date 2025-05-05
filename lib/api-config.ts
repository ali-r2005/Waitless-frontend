// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/login",
    REGISTER: "/api/register",
    LOGOUT: "/api/logout",
    USER: "/api/user",
    FORGOT_PASSWORD: "/api/forgot-password",
    RESET_PASSWORD: "/api/reset-password",
    UPDATE_PASSWORD: "/api/user/password",
    UPDATE_PROFILE: "/api/user/profile",
  },
  // Business Logic
  BUSINESS: {
    QUEUES: "/api/queues",
    BRANCHES: "/api/branches",
    STAFF: "/api/staff",
    ROLES: "/api/roles",
  }
}

// Default Headers
export const DEFAULT_HEADERS = {
  "Accept": "application/json",
  "Content-Type": "application/json"
}
