import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { authService } from "./auth-service"
import { getLocalStorage, setLocalStorage } from "./utils"

// Types
interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any | null>(() => getLocalStorage('user'))
  const router = useRouter()

  // Persist user data when it changes
  useEffect(() => {
    if (user) {
      setLocalStorage('user', user)
    } else {
      setLocalStorage('user', null)
    }
  }, [user])

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = getLocalStorage("auth_token")
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setIsAuthenticated(true)
        setUser(currentUser)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setLocalStorage("auth_token", null)
        setLocalStorage("user", null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
      setLocalStorage("auth_token", null)
      setLocalStorage("user", null)
    } finally {
      setIsLoading(false)
    }
  }

  // Check auth on mount and when token changes
  useEffect(() => {
    checkAuth()
    
    // Optional: Set up an interval to periodically validate the token
    const interval = setInterval(checkAuth, 5 * 60 * 1000) // Check every 5 minutes
    
    return () => clearInterval(interval)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await authService.login(email, password)
      if (result.success) {
        setIsAuthenticated(true)
        setUser(result.user)
        router.push("/dashboard")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setIsAuthenticated(false)
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 