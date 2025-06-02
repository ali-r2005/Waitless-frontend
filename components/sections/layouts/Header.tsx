"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Moon, Sun, Menu, X, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getPrivateChannel } from "@/lib/pusher-service"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Define type for notification
interface Notification {
  message: string;
  id: string;
  type: string;
  created_at?: string;
}

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  
  // Create a ref for the notification dropdown
  const notificationRef = useRef<HTMLDivElement>(null)
  
  // Check if user has a staff-related role (staff, branch_manager, business_owner)
  const isStaffRole = useMemo(() => {
    if (!isAuthenticated || !user?.role) return false
    const role = user.role.toLowerCase()
    return ['staff', 'branch_manager', 'business_owner'].includes(role)
  }, [isAuthenticated, user?.role])

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Subscribe to private user channel for notifications
  useEffect(() => {
    if (!user?.id) return;
    
    // Get the private channel for the authenticated user
    const channel = getPrivateChannel('App.Models.User.' + user.id);
    
    // Listen for NewMessageNotification events
    const listener = channel.listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (data: Notification) => {
      console.log('New notification received:', data);
      
      // Only handle NewMessageNotification type
      if (data.type === 'App\\Notifications\\NewMessageNotification') {
        // Set notification state to show the dot indicator
        setHasNewNotification(true);
        
        // Add timestamp if not provided
        const notificationWithDate = {
          ...data,
          created_at: data.created_at || new Date().toISOString()
        };
        
        // Add to notifications array (at the beginning to show newest first)
        setNotifications(prev => {
          // Check if notification with same ID already exists
          const exists = prev.some(n => n.id === data.id);
          if (exists) return prev; // Don't add duplicates
          
          // Add new notification and keep only the 20 most recent ones
          return [notificationWithDate, ...prev.slice(0, 19)];
        });
        
        // Show a toast notification
        toast({
          title: 'New Notification',
          description: data.message,
          className: 'bg-[#10bc69]/10 border-[#10bc69]/20',
        });
      }
    });
    
    // Cleanup function to unsubscribe when component unmounts
    return () => {
      channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', listener);
    };
  }, [user?.id]);
  
  // Function to handle notification click
  const handleNotificationClick = useCallback(() => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setHasNewNotification(false);
  }, [isNotificationMenuOpen])
  
  // Handle clicks outside of notification dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node) && isNotificationMenuOpen) {
        setIsNotificationMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationMenuOpen]);
  
  // Format date for display
  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

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

          {/* Desktop Navigation Links - Hidden for staff roles */}
          {!isStaffRole && (
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
          )}

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
            <div className="relative" ref={notificationRef}>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label="Notifications"
                onClick={handleNotificationClick}
              >
                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                {/* Notification dot (shown when there are new notifications) */}
                {hasNewNotification && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
              
              {/* Notification Dropdown */}
              {isNotificationMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        className="text-xs text-[#10bc69] hover:text-[#10bc69]/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications([]);
                        }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#10bc69]" />
                            <div>
                              <div className="text-sm text-gray-700 dark:text-gray-200">{notification.message}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {notification.created_at && formatNotificationDate(notification.created_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
              {/* Mobile Navigation Links - Hidden for staff roles */}
              {!isStaffRole && (
                <>
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
                </>
              )}
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
                <div className="relative" ref={notificationRef}>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    aria-label="Notifications"
                    onClick={handleNotificationClick}
                  >
                    <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    {/* Notification dot (shown when there are new notifications) */}
                    {hasNewNotification && (
                      <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  {/* Mobile Notification Dropdown */}
                  {isNotificationMenuOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Notifications</h3>
                        {notifications.length > 0 && (
                          <button 
                            className="text-xs text-[#10bc69] hover:text-[#10bc69]/80 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotifications([]);
                            }}
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#10bc69]" />
                                <div>
                                  <div className="text-sm text-gray-700 dark:text-gray-200">{notification.message}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {notification.created_at && formatNotificationDate(notification.created_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                            <p>No notifications yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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