"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { getLocalStorage, setLocalStorage } from "@/lib/utils"

type Attribute = "class" | "data-theme"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: Attribute
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Get initial theme safely
  const initialTheme = React.useMemo(() => {
    if (typeof window === 'undefined') return 'light'
    return getLocalStorage('theme') || 
           (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider
      {...props}
      defaultTheme={initialTheme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

export function useTheme() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const theme = React.useMemo(() => {
    if (!mounted) return 'light'
    return getLocalStorage('theme') || 
           (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  }, [mounted])

  const setTheme = React.useCallback((newTheme: string) => {
    if (typeof window === 'undefined') return

    if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
      setLocalStorage("theme", "light")
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      setLocalStorage("theme", "dark")
    } else {
      setLocalStorage("theme", null)
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  return {
    setTheme,
    theme,
    mounted
  }
}
