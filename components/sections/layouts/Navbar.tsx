"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

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
  }

  const handleLogoClick = () => {
    // First try to scroll to home section if on main page
    const homeSection = document.getElementById("home")
    if (homeSection) {
      scrollToSection("home")
    } else {
      // If not on main page, navigate to home page
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

          {/* Navigation Links */}
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

          {/* Right Side - Theme Toggle & Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && (
                <>
                  {theme === "dark" ? (
                    <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="h-6 w-6 text-gray-600" />
                  )}
                </>
              )}
            </button>
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
          </div>
        </div>
      </div>
    </nav>
  )
} 