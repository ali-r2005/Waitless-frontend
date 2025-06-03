"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { OwnerDashboard } from "@/components/sections/dashboards/owner-dashboard"
import { ManagerDashboard } from "@/components/sections/dashboards/manager-dashboard"
import { StaffQueueMonitor } from "@/components/sections/dashboards/staff-queue-monitor"

export default function DashboardPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Set loading to false after initial render
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-[#10bc69] animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-8 text-center">
          <div className="inline-block p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">{error}</h3>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // Role-based dashboards
  if (user?.role === "business_owner") return <DashboardLayout><div className="flex flex-col"><div className="flex-1 space-y-4 p-4 pt-6 md:p-8"><OwnerDashboard /></div></div></DashboardLayout>;
  if (user?.role === "branch_manager") return <DashboardLayout><div className="flex flex-col"><div className="flex-1 space-y-4 p-4 pt-6 md:p-8"><ManagerDashboard /></div></div></DashboardLayout>;
  if (user?.role === "staff") return <DashboardLayout><div className="flex flex-col"><div className="flex-1 space-y-4 p-4 pt-6 md:p-8"><StaffQueueMonitor user={user} /></div></div></DashboardLayout>;
  
  // Default fallback
  return (
    <DashboardLayout>
      <div className="text-center p-4">
        <h2 className="text-xl font-medium">Welcome to Waitless</h2>
        <p className="text-gray-500 mt-2">Your dashboard is loading...</p>
      </div>
    </DashboardLayout>
  );
}
