import type React from "react"
import { Clock } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
}

export function AuthLayout({ children, title = "Waitless" }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-4 flex items-center">
        <Clock className="h-8 w-8 text-primary-teal" />
        <span className="ml-2 text-2xl font-bold">{title}</span>
      </div>
      {children}
    </div>
  )
}
