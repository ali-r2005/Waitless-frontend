"use client"

import { useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { authService } from "@/lib/auth-service"
import { useRouter } from "next/navigation"
interface LogoutButtonProps extends ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  showIcon?: boolean
}

export function LogoutButton({ variant = "ghost", showIcon = true, children, ...props }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const result = await authService.logout()
      console.log("Logout result:", result)
      if (result.success) {
        router.push("/auth/login")
      } else {
        console.error("Logout failed:", result.error)
      }
    } catch (error) {
      console.log("Logout error:", error)
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
