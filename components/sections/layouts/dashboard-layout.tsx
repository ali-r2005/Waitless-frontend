"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Clock, Globe, Moon, Sun } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MainNav } from "@/components/features/navigation/main-nav"
import { MobileNav } from "@/components/features/navigation/mobile-nav"
import { LogoutButton } from "@/components/features/auth/logout-button"
import { useTheme } from "@/components/theme-provider"
import { getNavItems } from "@/lib/navigation"
import type { UserProfile } from "@/types/user"

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: UserProfile
  businessName?: string
}

export function DashboardLayout({
  children,
  user = {
    id: "1",
    name: "John Doe",
    email: "admin@example.com",
    role: "business_owner",
    createdAt: "January 15, 2023",
  },
  businessName = "QueueMaster",
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const navItems = getNavItems(user.role)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <MobileNav
            items={navItems}
            businessName={businessName}
            logo={<Clock className="h-6 w-6 text-primary-teal" />}
          />
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold md:hidden">
            <Clock className="h-6 w-6 text-primary-teal" />
            <span>{businessName}</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/profile" className="flex w-full items-center">
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogoutButton className="w-full justify-start cursor-pointer" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar Navigation (desktop) */}
        <aside className="hidden w-64 flex-col border-r bg-background md:flex">
          
          <MainNav items={navItems} />
        </aside>
        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
