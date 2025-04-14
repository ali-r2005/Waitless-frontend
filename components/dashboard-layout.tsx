"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  ChevronDown,
  Clock,
  Globe,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Play,
  PlusCircle,
  Settings,
  Sun,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "@/components/theme-provider"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: NavItem[]
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: "business_owner" | "branch_manager" | "staff" | "admin"
  businessName?: string
  userName?: string
  userAvatar?: string
}

export function DashboardLayout({
  children,
  userRole = "business_owner",
  businessName = "QueueMaster",
  userName = "John Doe",
  userAvatar,
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const businessOwnerNav: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { title: "Branches", href: "/branches", icon: <Building2 className="h-5 w-5" /> },
    { title: "Staff", href: "/staff", icon: <Users className="h-5 w-5" /> },
    {
      title: "Queue Management",
      href: "/queue",
      icon: <Clock className="h-5 w-5" />,
      submenu: [
        { title: "View Queues", href: "/queue", icon: <Clock className="h-5 w-5" /> },
        { title: "Add Queue", href: "/queue/create", icon: <PlusCircle className="h-5 w-5" /> },
        { title: "Add Customer", href: "/queue/add-customer", icon: <Users className="h-5 w-5" /> },
        { title: "Start Queue", href: "/queue/start", icon: <Play className="h-5 w-5" /> },
      ],
    },
    { title: "Invitations", href: "/invitations", icon: <MessageSquare className="h-5 w-5" /> },
    { title: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  const branchManagerNav: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    {
      title: "Queue Management",
      href: "/queue",
      icon: <Clock className="h-5 w-5" />,
      submenu: [
        { title: "View Queues", href: "/queue", icon: <Clock className="h-5 w-5" /> },
        { title: "Add Queue", href: "/queue/create", icon: <PlusCircle className="h-5 w-5" /> },
        { title: "Add Customer", href: "/queue/add-customer", icon: <Users className="h-5 w-5" /> },
        { title: "Start Queue", href: "/queue/start", icon: <Play className="h-5 w-5" /> },
      ],
    },
    { title: "Staff", href: "/staff", icon: <Users className="h-5 w-5" /> },
    { title: "Invitations", href: "/invitations", icon: <MessageSquare className="h-5 w-5" /> },
  ]

  const staffNav: NavItem[] = [
    { title: "View Queues", href: "/queue", icon: <Clock className="h-5 w-5" /> },
    { title: "Add Customer", href: "/queue/add-customer", icon: <Users className="h-5 w-5" /> },
    { title: "Start Queue", href: "/queue/start", icon: <Play className="h-5 w-5" /> },
    { title: "My Profile", href: "/profile", icon: <Users className="h-5 w-5" /> },
  ]

  const adminNav: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { title: "Businesses", href: "/businesses", icon: <Building2 className="h-5 w-5" /> },
    { title: "Analytics", href: "/analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { title: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  const navItems = {
    business_owner: businessOwnerNav,
    branch_manager: branchManagerNav,
    staff: staffNav,
    admin: adminNav,
  }[userRole]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b px-4">
                  <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Clock className="h-6 w-6 text-primary-teal" />
                    <span>{businessName}</span>
                  </Link>
                </div>
                <nav className="grid gap-2 p-4">
                  {navItems?.map((item) => (
                    <div key={item.title}>
                      {item.submenu ? (
                        <div>
                          <button
                            onClick={() => toggleSubmenu(item.title)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              openSubmenu === item.title ? "bg-accent text-accent-foreground" : "transparent",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon}
                              {item.title}
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                openSubmenu === item.title ? "rotate-180" : "",
                              )}
                            />
                          </button>
                          {openSubmenu === item.title && (
                            <div className="ml-6 mt-1 grid gap-1">
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.title}
                                  href={subitem.href}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                    pathname === subitem.href ? "bg-accent text-accent-foreground" : "transparent",
                                  )}
                                >
                                  {subitem.icon}
                                  {subitem.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                          )}
                        >
                          {item.icon}
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
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
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName
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
                <Link href="/logout" className="flex w-full items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar Navigation (desktop) */}
        <aside className="hidden w-64 flex-col border-r bg-background md:flex">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Clock className="h-6 w-6 text-primary-teal" />
              <span>{businessName}</span>
            </Link>
          </div>
          <nav className="grid gap-2 p-4">
            {navItems?.map((item) => (
              <div key={item.title}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        openSubmenu === item.title ? "bg-accent text-accent-foreground" : "transparent",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {item.title}
                      </div>
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", openSubmenu === item.title ? "rotate-180" : "")}
                      />
                    </button>
                    {openSubmenu === item.title && (
                      <div className="ml-6 mt-1 grid gap-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.title}
                            href={subitem.href}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              pathname === subitem.href ? "bg-accent text-accent-foreground" : "transparent",
                            )}
                          >
                            {subitem.icon}
                            {subitem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
