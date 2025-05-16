import api from "./axios"
import { API_ENDPOINTS } from "./api-config"

export const authService = {
  async login(email: string, password: string) {
    try {
      const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
      const data = res.data as { access_token?: string; user?: any; message?: string }
      const { access_token, user, message } = data
      if (access_token) {
        localStorage.setItem("auth_token", access_token)
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`
      }
      return { success: !!access_token, user, error: message }
    } catch (error: any) {
      return {
        success: false,
        user: null,
        error: error.response?.data?.message || "Login failed. Please try again."
      }
    }
  },

  async register(data: any) {
    try {
      let payload: any = data
      let config = {}
      if (data.logo) {
        payload = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) payload.append(key, value as any)
        })
        config = { headers: { 'Content-Type': 'multipart/form-data' } }
      }
      const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload, config)
      const dataRes = res.data as { access_token?: string; user?: any; message?: string }
      const { access_token, user, message } = dataRes
      if (access_token) {
        localStorage.setItem("auth_token", access_token)
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`
      }
      return { success: !!access_token, user, error: message }
    } catch (error: any) {
      return {
        success: false,
        user: null,
        error: error.response?.data?.message || "Registration failed. Please try again."
      }
    }
  },

  async logout() {
    try {
      const res = await api.post(API_ENDPOINTS.AUTH.LOGOUT)
      if (res.status === 200) {
        localStorage.removeItem("auth_token")
        delete api.defaults.headers.common["Authorization"]
        return { success: true }
      } else {
        const data = res.data as { message?: string }
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: "Logout API call failed" }
    }
  },

  async setToken(token: string) {
    localStorage.setItem("auth_token", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  },

  async getCurrentUser() {
    try {
      const res = await api.get(API_ENDPOINTS.AUTH.USER)
      return res.data
    } catch (error: any) {
      return null
    }
  },
}

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
