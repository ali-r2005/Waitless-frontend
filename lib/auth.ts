import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "./validations/auth"

// Mock database for demonstration purposes
// In a real application, you would use a proper database
interface User {
  id: string
  name: string
  email: string
  password: string
  role: "business_owner" | "branch_manager" | "staff"
  businessId?: string
  branchId?: string
}

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "admin@example.com",
    // Hashed password for "password123"
    password: "$2a$10$8Ux9XCx0bTZHQOIkQdO4B.aCL5QOk9Yl0.tCZyHW5Ug7RZF.CX3Hy",
    role: "business_owner",
  },
]

// Re-export the schemas
export { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema }

// Authentication functions
export async function login(email: string, password: string) {
  // Find user by email
  const user = users.find((u) => u.email === email)
  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return { success: false, error: "Invalid email or password" }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("session", crypto.randomUUID(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export async function register(name: string, email: string, password: string, businessName: string) {
  // Check if user already exists
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return { success: false, error: "Email already in use" }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
    role: "business_owner",
  }

  // Add user to database
  users.push(newUser)

  // Set session cookie
  const sessionId = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return {
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  }
}

export async function logout() {
  // Clear session cookie
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/auth/login")
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    return null
  }

  // Mock user for demonstration
  return {
    user: {
      id: "1",
      name: "John Doe",
      email: "admin@example.com",
      role: "business_owner",
    },
  }
}

export async function forgotPassword(email: string) {
  // Find user by email
  const user = users.find((u) => u.email === email)
  if (!user) {
    // Don't reveal if the email exists or not for security reasons
    return { success: true }
  }

  // In a real app, you would generate a reset token and send an email
  // For this example, we'll just return success

  return { success: true }
}

export async function resetPassword(token: string, password: string) {
  // In a real app, you would validate the token and update the user's password
  // For this example, we'll just return success

  return { success: true }
}
