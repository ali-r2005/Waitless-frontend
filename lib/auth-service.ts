import api from "./axios"
import { API_ENDPOINTS } from "./api-config"

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
    const { access_token, user } = res.data

    if (access_token) {
      localStorage.setItem("auth_token", access_token)
      document.cookie = `auth_token=${access_token}; path=/; SameSite=Strict;`
    }

    return { success: true, user, error: res.data.message }
  },

  async register(data: any) {
    const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, data)
    const { access_token, user } = res.data

    if (access_token) {
      localStorage.setItem("auth_token", access_token)
      document.cookie = `auth_token=${access_token}; path=/; SameSite=Strict;`
    }

    return { success: true, user, error: res.data.message }
  },

  async logout() {
    try {
      // Call the backend logout endpoint
      const res = await api.post(API_ENDPOINTS.AUTH.LOGOUT)
      if (res.status === 200) {
        localStorage.removeItem("auth_token")
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
        return { success: true }
      } else {
        return { success: false, error: res.data.message }
      }
    } catch (error) {
      console.error("Logout API call failed:", error)
      return { success: false, error: "Logout API call failed" }
    }
  },
  // Inside authService
  async setToken(token: string) {
    localStorage.setItem("auth_token", token)
  },


  async getCurrentUser() {
    try {
      const res = await api.get(API_ENDPOINTS.AUTH.USER)
      return res.data
    } catch {
      return null
    }
  },
}

// Add missing functions
export async function updateProfile(data: any) {
  try {
    const res = await api.post(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data)
    return { success: true, user: res.data }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to update profile" 
    }
  }
}

export async function updatePassword(data: any) {
  try {
    const res = await api.post(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, data)
    return { success: true }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to update password" 
    }
  }
}
