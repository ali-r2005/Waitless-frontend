export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "system_admin" | "business_owner" | "branch_manager" | "staff" | "customer" | "guest"
  branch_id: number | null
  business_id: number | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterFormValues {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  role?: "business_owner"
  business_name?: string
  industry?: string
  logo?: File
}

export interface ForgotPasswordFormValues {
  email: string
}

export interface ResetPasswordRequestValues {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  message?: string
}
