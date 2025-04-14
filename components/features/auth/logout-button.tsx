"use client"

import { useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface LogoutButtonProps extends ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  showIcon?: boolean
}

export function LogoutButton({ variant = "ghost", showIcon = true, children, ...props }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { logout } = useAuth()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} onClick={handleLogout} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || "Log out"}
    </Button>
  )
}
