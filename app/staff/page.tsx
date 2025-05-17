"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Users, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthorization } from "@/hooks/use-authorization"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/ui/page-header"
import { StaffTable } from "@/components/features/tables/staff-table"
import { StaffRequestsTable } from "@/components/features/tables/staff-requests-table"
import { staffService } from "@/lib/staff-service"
import type { StaffMember, StaffRequest, StaffUser } from "@/types/staff"

export default function StaffPage() {
  const router = useRouter()
  const { isAuthorized, isLoading: authLoading, user } = useAuthorization(['business_owner', 'branch_manager'])

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [branchManagers, setBranchManagers] = useState<StaffMember[]>([])
  const [pendingRequests, setPendingRequests] = useState<StaffRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<StaffUser[]>([])

  // Process staff data for display
  const processedStaff = staff.map(member => ({
    ...member,
    // Add display properties if not present
    role: member.role || `Role ID: ${member.staff?.role_id || 'Unknown'}`,
    branch: member.branch || `Branch ID: ${member.branch_id || 'Unknown'}`,
    status: member.status || 'active'
  }))
  
  // Filter staff based on search query
  const filteredStaff = processedStaff.filter((member) =>
    (member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (member.role && member.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (member.branch && member.branch.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleStaffAction = async (action: string, staffId: number) => {
    if (action === 'remove') {
      setIsLoading(true)
      try {
        await staffService.removeUserFromStaff(staffId)
        setStaff((prev) => prev.filter((member) => member.id !== staffId))
      } catch (error) {
        console.error('Error removing staff:', error)
      } finally {
        setIsLoading(false)
      }
    } else if (action === 'promote') {
      setIsLoading(true)
      try {
        await staffService.promoteToBranchManager(staffId)
        // Refresh data after promotion
        await fetchData()
      } catch (error) {
        console.error('Error promoting staff to branch manager:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Other actions like edit, change role, etc.
      console.log(`Action: ${action}, Staff ID: ${staffId}`)
    }
  }

  const handleApproveRequest = async (requestId: number) => {
    setIsLoading(true)
    try {
      // Note: There is no pending request logic in the backend API
      // This is just a placeholder for future implementation
      console.log(`Approve request: ${requestId}`)
      // Remove the request from pending requests
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId))
    } catch (error) {
      console.error('Error approving request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectRequest = async (requestId: number) => {
    setIsLoading(true)
    try {
      // In a real implementation, this would call an API endpoint to reject the request
      console.log(`Reject request: ${requestId}`)
      // Remove the request from pending requests
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId))
    } catch (error) {
      console.error('Error rejecting request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  // Search for users to add as staff
  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const results = await staffService.searchUsers(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStaff = async (userId: number, roleId: number, branchId: number) => {
    setIsLoading(true)
    try {
      await staffService.addUserToStaff(userId, roleId, branchId)
      // Refresh staff list after adding new staff
      await fetchData()
      setSearchResults([])
      setSearchQuery('')
    } catch (error) {
      console.error('Error adding staff:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch all data
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch staff members
      const staffMembers = await staffService.getStaffMembers()
      setStaff(staffMembers)
      
      // Fetch branch managers
      const managers = await staffService.listBranchManagers()
      setBranchManagers(managers)
      
      // In a real implementation, we would fetch pending requests here
      // For now, using empty array since there's no pending request API
      setPendingRequests([])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch staff members when component mounts
  useEffect(() => {
    if (isAuthorized) {
      fetchData()
    }
  }, [isAuthorized])

  // If still checking authorization or not authorized
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Checking authorization...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthorized) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <Users className="h-8 w-8 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Access Denied</h3>
            <p className="text-sm text-muted-foreground">
              You don't have permission to access this page. Please contact your administrator.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your staff members and role requests
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button onClick={() => {
              setSearchQuery('')
              setSearchResults([])
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
          
          {/* Search results for adding new staff */}
          {searchResults.length > 0 && (
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-lg font-medium">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary-teal/10 flex items-center justify-center text-primary-teal">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleAddStaff(user.id, 1, 1)}>
                      <Plus className="mr-1 h-3 w-3" /> Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Search form for adding new staff */}
          {searchResults.length === 0 && (
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-lg font-medium">Add New Staff Member</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Search users by name or email"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="max-w-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchUsers();
                    }
                  }}
                />
                <Button onClick={handleSearchUsers} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="all-staff" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all-staff">All Staff</TabsTrigger>
              <TabsTrigger value="branch-managers">Branch Managers</TabsTrigger>
              <TabsTrigger value="pending-requests">
                Pending Requests
                <Badge variant="greenOutline" className="ml-2">
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
