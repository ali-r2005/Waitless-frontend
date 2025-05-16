"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Menu, X, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
    setIsMenuOpen(false) // Close menu after clicking a link
  }

  const handleLogoClick = () => {
    const homeSection = document.getElementById("home")
    if (homeSection) {
      scrollToSection("home")
    } else {
      router.push("/")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/images/logoqueue.png"
              alt="Logo"
              width={120}
              height={120}
              className="cursor-pointer"
              onClick={handleLogoClick}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69]"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Right Side - Theme Toggle, Notification, and User Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {mounted && (
                <>
                  {theme === "dark" ? (
                    <Sun className="h-6 w-6 text-gray-300" />
                  ) : (
                    <Moon className="h-6 w-6 text-gray-600" />
                  )}
                </>
              )}
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              {/* Notification dot (optional) */}
              {/* <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" /> */}
            </button>
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-0">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name || user.email} />
                      <AvatarFallback>{user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1 text-sm font-semibold">{user.name || user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-[#10bc69] text-white rounded-lg hover:bg-[#10bc69]/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
              >
                Contact
              </button>
              <div className="flex items-center space-x-4 px-3 py-2">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {mounted && (
                    <>
                      {theme === "dark" ? (
                        <Sun className="h-6 w-6 text-gray-300" />
                      ) : (
                        <Moon className="h-6 w-6 text-gray-600" />
                      )}
                    </>
                  )}
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-0">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name || user.email} />
                          <AvatarFallback>{user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1 text-sm font-semibold">{user.name || user.email}</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600">Log Out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-gray-600 hover:text-[#10bc69] dark:text-gray-300 dark:hover:text-[#10bc69] transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-4 py-2 bg-[#10bc69] text-white rounded-lg hover:bg-[#10bc69]/90 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}