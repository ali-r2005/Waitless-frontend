"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Users, Check } from "lucide-react"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/ui/page-header"
import { StaffTable } from "@/components/features/tables/staff-table"
import { StaffRequestsTable } from "@/components/features/tables/staff-requests-table"
import { getStaffMembers, getPendingStaffRequests } from "@/lib/data-service"
import { staffService } from "@/lib/staff-service"
import { StaffMember, StaffRequest } from "@/types/staff"

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [branchManagers, setBranchManagers] = useState<StaffMember[]>([])
  const [pendingRequests, setPendingRequests] = useState<StaffRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Load all staff members
      const allStaff = await getStaffMembers()
      setStaff(allStaff)
      
      // Load branch managers
      const managers = await staffService.listBranchManagers()
      setBranchManagers(managers)
      
      // Load pending requests
      const requests = await getPendingStaffRequests()
      setPendingRequests(requests)
    } catch (err) {
      setError("Failed to load staff data")
      console.error("Error loading data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter staff based on search query
  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.role && member.role.description && member.role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleStaffAction = async (action: string, staffId: string) => {
    try {
      switch (action) {
        case "edit":
          // TODO: Implement edit functionality
          console.log(`Editing staff member: ${staffId}`)
          break
        case "delete":
          await staffService.removeUserFromStaff(staffId)
          await loadData() // Refresh the data
          break
        case "promote":
          await staffService.promoteToBranchManager(staffId)
          await loadData() // Refresh the data
          break
        case "demote":
          await staffService.removeBranchManagerRole(staffId)
          await loadData() // Refresh the data
          break
        default:
          console.warn(`Unknown action: ${action}`)
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      // TODO: Implement actual approval logic
      console.log(`Approving request: ${requestId}`)
      await loadData() // Refresh the data
    } catch (error) {
      console.error("Error approving request:", error)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      // TODO: Implement actual rejection logic
      console.log(`Rejecting request: ${requestId}`)
      await loadData() // Refresh the data
    } catch (error) {
      console.error("Error rejecting request:", error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    try {
      const results = await staffService.searchUsers(query)
      setStaff(results)
    } catch (error) {
      console.error("Error searching staff:", error)
    }
  }

  const handleInviteStaff = async () => {
    try {
      // TODO: Implement invite staff functionality
      console.log("Inviting new staff")
    } catch (error) {
      console.error("Error inviting staff:", error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="Staff Management"
            actions={
              <Button 
                className="bg-primary-teal hover:bg-primary-teal/90"
                onClick={handleInviteStaff}
              >
                <Plus className="mr-2 h-4 w-4" />
                Invite New Staff
              </Button>
            }
          />

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all-staff" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all-staff">All Staff</TabsTrigger>
              <TabsTrigger value="branch-managers">Branch Managers</TabsTrigger>
              <TabsTrigger value="pending-requests">
                Pending Requests
                <Badge className="ml-2 bg-primary-teal text-primary-foreground">
                  {pendingRequests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-staff">
              <StaffTable staff={filteredStaff} onAction={handleStaffAction} />
            </TabsContent>

            <TabsContent value="branch-managers">
              <StaffTable staff={branchManagers} onAction={handleStaffAction} />
            </TabsContent>

            <TabsContent value="pending-requests">
              <StaffRequestsTable
                requests={pendingRequests}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
