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
  // Queue Management
  QUEUES: {
    LIST: "/api/queues",
    CREATE: "/api/queues",
    DETAILS: (id: string) => `/api/queues/${id}`,
    UPDATE: (id: string) => `/api/queues/${id}`,
    DELETE: (id: string) => `/api/queues/${id}`,
  },
  QUEUE_MANAGEMENT: {
    ADD_CUSTOMER: "/api/queue-management/add-customer",
    REMOVE_CUSTOMER: "/api/queue-management/remove-customer",
    CUSTOMERS: "/api/queue-management/customers",
    MOVE_CUSTOMER: (id: string) => `/api/queue-management/customers/${id}/move`,
    ACTIVATE: "/api/queue-management/activate",
    CALL_NEXT: "/api/queue-management/call-next",
    COMPLETE_SERVING: "/api/queue-management/complete-serving",
    MARK_LATE: "/api/queue-management/customers/late",
    GET_LATE: "/api/queue-management/customers/late",
    REINSERT_LATE: "/api/queue-management/customers/reinsert",
  },
  // User Management
  USERS: {
    SEARCH: "/api/users/search",
  },
  // Business Logic
  BUSINESS: {
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
