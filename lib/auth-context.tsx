'use client';

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "./auth-service"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  register: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      // Check if we have a token in either storage
      const hasToken = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
      
      if (!hasToken) {
        setUser(null)
        setIsAuthenticated(false)
        return
      }
      
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        // If we have a token but no user, the token might be invalid
        localStorage.removeItem("auth_token")
        sessionStorage.removeItem("auth_token")
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authService.login(email, password)
      if (result.success) {
        await refreshUser()
        router.push("/dashboard")
      } else {
        throw new Error(result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
      router.push("/auth/login")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: any) => {
    setIsLoading(true)
    try {
      const result = await authService.register(data)
      if (result.success) {
        await refreshUser()
        router.push("/dashboard")
      } else {
        throw new Error(result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initialize auth state on mount
    const initAuth = async () => {
      setIsLoading(true)
      await refreshUser()
      setIsLoading(false)
    }
    
    initAuth()
    
    // Set up an interval to periodically refresh the user session
    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        refreshUser()
      }
    }, 15 * 60 * 1000) // Refresh every 15 minutes
    
    return () => clearInterval(refreshInterval)
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, refreshUser, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
