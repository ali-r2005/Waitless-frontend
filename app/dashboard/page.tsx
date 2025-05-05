"use client"

import { useEffect, useState } from "react"
import { Building2, Clock, Users, BellRing, BarChart4, ArrowUp, ArrowDown, Activity } from "lucide-react"
import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { branchService } from "@/lib/branch-service"
import type { Branch } from "@/types/branch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await branchService.getBranches()
        setBranches(data)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBranches()
  }, [])

  // Calculate statistics
  const totalBranches = branches.length
  const totalStaff = 12 // This should come from your API
  const activeQueues = 2 // This should come from your API
  const pendingInvitations = 3 // This should come from your API

  // Mock performance data - replace with real data from your API
  const branchPerformance = branches.map(branch => ({
    ...branch,
    performance: Math.floor(Math.random() * 100), // Replace with real performance metrics
    trend: Math.random() > 0.5 ? 'up' : 'down',
    difference: Math.floor(Math.random() * 10)
  }))

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10bc69]"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500 text-center p-4">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Dashboard Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#10bc69] to-[#0f9a58] bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
          <div className="flex gap-4">
              <Button className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-[#10bc69] transition-all duration-300">
                <BarChart4 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button className="bg-[#10bc69] hover:bg-[#0f9a58] text-white transition-all duration-300">
                <Activity className="h-4 w-4 mr-2" />
                Live Overview
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group overflow-hidden border border-gray-100 dark:border-gray-700 rounded-xl transform transition-all duration-300 hover:shadow-lg hover:border-[#10bc69] dark:hover:border-[#10bc69] hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 group-hover:bg-[#10bc69]/10 transition-colors duration-300">
                <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-[#10bc69] dark:group-hover:text-[#10bc69] transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalBranches}</div>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-4 w-4 text-[#10bc69] mr-1" />
                <p className="text-xs text-[#10bc69]">
                +1 from last month
              </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border border-gray-100 dark:border-gray-700 rounded-xl transform transition-all duration-300 hover:shadow-lg hover:border-[#10bc69] dark:hover:border-[#10bc69] hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 group-hover:bg-[#10bc69]/10 transition-colors duration-300">
                <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-[#10bc69] dark:group-hover:text-[#10bc69] transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalStaff}</div>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-4 w-4 text-[#10bc69] mr-1" />
                <p className="text-xs text-[#10bc69]">
                +2 from last month
              </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border border-gray-100 dark:border-gray-700 rounded-xl transform transition-all duration-300 hover:shadow-lg hover:border-[#10bc69] dark:hover:border-[#10bc69] hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 group-hover:bg-[#10bc69]/10 transition-colors duration-300">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-[#10bc69] dark:group-hover:text-[#10bc69] transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{activeQueues}</div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                Active in {totalBranches} branches
              </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border border-gray-100 dark:border-gray-700 rounded-xl transform transition-all duration-300 hover:shadow-lg hover:border-[#10bc69] dark:hover:border-[#10bc69] hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 group-hover:bg-[#10bc69]/10 transition-colors duration-300">
                <BellRing className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-[#10bc69] dark:group-hover:text-[#10bc69] transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{pendingInvitations}</div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                Awaiting response
              </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Branch Performance */}
        <Card className="border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="relative inline-block">
              Branch Performance
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-[#10bc69]"></span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {branchPerformance.map((branch) => (
                <div key={branch.id} className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#10bc69] dark:hover:border-[#10bc69] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#10bc69]"></div>
                      <span className="text-sm font-medium">{branch.name}</span>
                    </div>
                    <div className="flex items-center">
                      {branch.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-[#10bc69] mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${branch.trend === 'up' ? 'text-[#10bc69]' : 'text-red-500'}`}>
                        {branch.difference}%
                      </span>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                      <div
                        style={{ width: `${branch.performance}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#10bc69] to-[#0f9a58]"
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block text-right">
                      {branch.performance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="relative inline-block">
              Recent Notifications
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-[#10bc69]"></span>
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have 3 unread notifications
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#10bc69] dark:hover:border-[#10bc69] transition-all duration-300">
                <div className="rounded-full bg-[#10bc69]/10 p-3">
                  <Users className="h-5 w-5 text-[#10bc69]" />
                </div>
                <div>
                  <p className="text-sm font-medium">New staff request</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sarah Johnson requested to join Downtown Branch
                  </p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" className="hover:text-red-500 hover:border-red-500">Reject</Button>
                  <Button size="sm" className="bg-[#10bc69] hover:bg-[#0f9a58]">Approve</Button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#10bc69] dark:hover:border-[#10bc69] transition-all duration-300">
                <div className="rounded-full bg-[#10bc69]/10 p-3">
                  <Clock className="h-5 w-5 text-[#10bc69]" />
                </div>
                <div>
                  <p className="text-sm font-medium">Queue capacity reached</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Main Branch queue is at 90% capacity
                  </p>
                </div>
                <div className="ml-auto">
                  <Button size="sm" className="bg-[#10bc69] hover:bg-[#0f9a58]">Take Action</Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6 border-[#10bc69] text-[#10bc69] hover:bg-[#10bc69] hover:text-white transition-all duration-300">
              View all notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
