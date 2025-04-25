"use client"

import { useEffect, useState } from "react"
import { Building2, Clock, Users, BellRing } from "lucide-react"
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
    performance: Math.floor(Math.random() * 100) // Replace with real performance metrics
  }))

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-teal"></div>
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
      <div className="flex flex-col space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="outline">Analytics</Button>
            <Button variant="outline">Notifications</Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBranches}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeQueues}</div>
              <p className="text-xs text-muted-foreground">
                Active in {totalBranches} branches
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
              <BellRing className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvitations}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting response
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Branch Performance */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {branchPerformance.map((branch) => (
                <div key={branch.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary-teal"></div>
                      <span className="text-sm font-medium">{branch.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {branch.performance}%
                    </span>
                  </div>
                  <Progress value={branch.performance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <p className="text-sm text-muted-foreground">
              You have 3 unread notifications
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">New staff request</p>
                  <p className="text-sm text-muted-foreground">
                    Sarah Johnson requested to join Downtown Branch
                  </p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm">Reject</Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Queue capacity reached</p>
                  <p className="text-sm text-muted-foreground">
                    Main Branch queue is at 90% capacity
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              View all notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
