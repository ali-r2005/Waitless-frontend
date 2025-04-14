import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe localStorage access
export const getLocalStorage = (key: string, defaultValue: any = null) => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const value = localStorage.getItem(key)
    if (!value) return defaultValue
    
    // Handle theme value specially since it's just a string
    if (key === 'theme') return value
    
    // For other values, try parsing as JSON
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    return defaultValue
  }
}

export const setLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return
  try {
    // Handle theme value specially since it's just a string
    if (key === 'theme') {
      if (value === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, value)
      }
      return
    }
    
    // For other values, stringify as JSON
    if (value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}
