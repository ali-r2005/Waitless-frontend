export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  businessId?: string
  branchId?: string
  phone?: string
  jobTitle?: string
  avatar?: string
  createdAt: string
}

export type UserRole = "business_owner" | "branch_manager" | "staff" | "admin"

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  jobTitle?: string
  avatar?: string
  role: UserRole
  createdAt: string
}

export interface ProfileFormValues {
  name: string
  email: string
  phone?: string
  jobTitle?: string
}

export interface PasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
