"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService } from "@/lib/auth-service"
import type { UserRole } from "@/types/user"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/", 
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password"
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    // Skip auth check for public paths
    if (PUBLIC_PATHS.some(path => pathname === path || pathname?.startsWith(path + "/"))) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push(`/auth/login?callback=${encodeURIComponent(pathname || "/dashboard")}`)
        return
      }

      const userData = await authService.getCurrentUser()
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem("auth_token")
        router.push(`/auth/login?callback=${encodeURIComponent(pathname || "/dashboard")}`)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("auth_token")
      router.push(`/auth/login?callback=${encodeURIComponent(pathname || "/dashboard")}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await authService.login(email, password)
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        router.push("/dashboard")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("auth_token")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("auth_token")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setUser(null)
        setIsAuthenticated(false)
        return
      }

      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem("auth_token")
      }
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("auth_token")
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
