import { type ClassValue, clsx } from "clsx"
export function formatSecondsFriendly(totalSeconds: number | string | undefined | null): string {
  if (totalSeconds === null || totalSeconds === undefined) {
    return 'N/A';
  }

  let seconds = typeof totalSeconds === 'string' ? Number(totalSeconds) : totalSeconds;

  if (isNaN(seconds) || seconds < 0) {
    return 'N/A';
  }

  // Round to the nearest whole number to clean up floating point artifacts
  seconds = Math.round(seconds);

  if (seconds === 0) {
    return '0s';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}s`);
  }

  return parts.join(' ');
}

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

/**
 * Format a date in a locale-aware manner
 * @param dateString Date string or Date object to format
 * @param options Intl.DateTimeFormatOptions to customize formatting
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date, options: Intl.DateTimeFormatOptions = {}) => {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  // Default options for date formatting
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date)
}

/**
 * Format a time string
 * @param timeString Time string in HH:MM format
 * @returns Formatted time (e.g., "9:00 AM")
 */
export const formatTime = (timeString: string) => {
  if (!timeString) return ''
  
  // If it's already in HH:MM format, parse it
  const [hours, minutes] = timeString.split(':').map(Number)
  
  if (isNaN(hours) || isNaN(minutes)) return timeString
  
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
