import api from "./axios"
import { API_ENDPOINTS } from "./api-config"
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordRequestValues,
  AuthResult,
} from "@/types/auth"

// Types
interface AuthResponse {
  success: boolean
  user?: any
  message?: string
  error?: string
}

// Auth Service
export const authService = {
  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
      const { access_token, user } = response.data

      if (access_token) {
        localStorage.setItem("auth_token", access_token)
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`
      }

      return { success: true, user, message: "Login successful" }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Invalid credentials" 
      }
    }
  },

  // Register
  async register(data: any): Promise<AuthResponse> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data)
      const { access_token, user } = response.data

      if (access_token) {
        localStorage.setItem("auth_token", access_token)
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`
      }

      return { success: true, user, message: "Registration successful" }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Registration failed" 
      }
    }
  },

  // Logout
  async logout(): Promise<AuthResponse> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT)
      localStorage.removeItem("auth_token")
      delete api.defaults.headers.common["Authorization"]
      return { success: true, message: "Logout successful" }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Logout failed" 
      }
    }
  },

  // Get Current User
  async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.USER)
      return response.data
    } catch (error) {
      return null
    }
  },

  // Update Profile
  async updateProfile(data: any): Promise<AuthResponse> {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data)
      return { 
        success: true, 
        user: response.data.user,
        message: "Profile updated successfully" 
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Update failed" 
      }
    }
  },

  // Update Password
  async updatePassword(data: any): Promise<AuthResponse> {
    try {
      await api.put(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, data)
      return { success: true, message: "Password updated successfully" }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Password update failed" 
      }
    }
  }
}

/**
 * Request password reset link
 */
export async function forgotPassword(data: ForgotPasswordFormValues): Promise<AuthResult> {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
    return {
      success: true,
      message: response.data.status
    }
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send reset link"
    }
  }
}

/**
 * Reset password using token
 */
export async function resetPassword(data: ResetPasswordRequestValues): Promise<AuthResult> {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
    return {
      success: true,
      message: response.data.status
    }
  } catch (error: any) {
    console.error("Reset password error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reset password"
    }
  }
}
