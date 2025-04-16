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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authService.login(email, password)
      await refreshUser()
      router.push("/dashboard")
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

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
