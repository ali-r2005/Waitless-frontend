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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { staffService } from "@/lib/staff-service"
import { roleService } from "@/lib/role-service"
import { branchService } from "@/lib/branch-service"
import type { StaffMember, StaffUser } from "@/types/staff"
import type { Role } from "@/lib/role-service"
import type { Branch } from "@/types/branch"

export default function StaffPage() {
  const router = useRouter()
  const { isAuthorized, isLoading: authLoading, user } = useAuthorization(['business_owner', 'branch_manager'])

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [branchManagers, setBranchManagers] = useState<StaffMember[]>([])
  // State for pending staff requests
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  // State for filtering existing staff
  const [staffSearchQuery, setStaffSearchQuery] = useState("")
  
  // State for searching users to add as staff
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userSearchResults, setUserSearchResults] = useState<StaffUser[]>([])
  
  // Shared loading state
  const [isLoading, setIsLoading] = useState(false)
  
  // For role and branch selection
  const [roles, setRoles] = useState<Role[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null)

  // Process staff data for display
  const processedStaff = staff.map(member => ({
    ...member,
    // Add display properties if not present
    role: member.role || `Role ID: ${member.staff?.role_id || 'Unknown'}`,
    branch: member.branch || `Branch ID: ${member.branch_id || 'Unknown'}`,
    status: member.status || 'active',
    // Ensure avatar is available for the StaffTable component (keep it undefined if not present)
    avatar: member.avatar
  }))
  
  // Filter staff based on staff search query
  const filteredStaff = processedStaff.filter((member) =>
    !staffSearchQuery.trim() ? true : (
      (member.name && member.name.toLowerCase().includes(staffSearchQuery.toLowerCase())) ||
      (member.email && member.email.toLowerCase().includes(staffSearchQuery.toLowerCase())) ||
      (member.role && member.role.toLowerCase().includes(staffSearchQuery.toLowerCase())) ||
      (member.branch && member.branch.toLowerCase().includes(staffSearchQuery.toLowerCase()))
    )
  )

  const handleStaffAction = async (action: string, staffId: number) => {
    setIsLoading(true)
    try {
      switch (action) {
        case 'remove':
          await staffService.removeUserFromStaff(staffId)
          // Update both staff lists
          setStaff((prev) => prev.filter((member) => member.id !== staffId))
          setBranchManagers((prev) => prev.filter((member) => member.id !== staffId))
          console.log('Staff member removed successfully')
          break

        case 'promote':
          await staffService.promoteToBranchManager(staffId)
          // Refresh data after promotion
          await fetchData()
          console.log('Staff member promoted to branch manager successfully')
          break

        case 'removeBranchManagerRole':
          await staffService.removeBranchManagerRole(staffId)
          // Refresh data after removing branch manager role
          await fetchData()
          console.log('Branch manager role removed successfully')
          break

        default:
          console.log(`Unhandled action: ${action} for Staff ID: ${staffId}`)
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStaffSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaffSearchQuery(e.target.value)
  }
  
  const handleUserSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchQuery(e.target.value)
  }
  
  const fetchStaffData = async () => {
    try {
      setIsLoading(true)
      const staffData = await staffService.getStaffMembers()
      const branchManagersData = await staffService.listBranchManagers()
      
      setStaff(staffData)
      setBranchManagers(branchManagersData)
    } catch (error) {
      console.error("Error fetching staff data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchUsers = async () => {
    if (!userSearchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const results = await staffService.searchUsersToAddAsStaff(userSearchQuery)
      setUserSearchResults(results)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle selecting a user to add as staff
  const handleSelectUser = (user: StaffUser) => {
    setSelectedUser(user);
    setShowAddForm(true);
  }
  
  // Handle adding a staff member with selected role and branch
  const handleAddStaff = async () => {
    if (!selectedUser || !selectedRoleId || !selectedBranchId) {
      console.error('Missing required data for adding staff');
      return;
    }
    
    setIsLoading(true);
    try {
      // Ensure we're passing numbers, not strings
      const userIdNum = Number(selectedUser.id);
      const roleIdNum = Number(selectedRoleId);
      const branchIdNum = Number(selectedBranchId);
      
      console.log('Adding staff with params:', { userIdNum, roleIdNum, branchIdNum });
      
      await staffService.addUserToStaff(userIdNum, roleIdNum, branchIdNum);
      
      // Show success message (you could add a toast notification here)
      console.log('Successfully added staff member');
      
      // Reset form
      setSelectedUser(null);
      setShowAddForm(false);
      
      // Refresh staff list after adding new staff
      await fetchData();
      setUserSearchResults([]);
      setUserSearchQuery('');
    } catch (error: any) {
      console.error('Error adding staff:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      // You could add a toast notification for the error here
    } finally {
      setIsLoading(false);
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
      
      // Fetch roles and branches for the add staff form
      const rolesData = await roleService.getRoles()
      setRoles(rolesData)
      
      const branchesData = await branchService.getBranches()
      setBranches(branchesData)
      
      // Set default selections if available
      if (rolesData.length > 0 && !selectedRoleId) {
        setSelectedRoleId(rolesData[0].id)
      }
      
      if (branchesData.length > 0 && !selectedBranchId) {
        setSelectedBranchId(branchesData[0].id)
      }
      
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
        
        {/* Staff Management Section */}
        <div className="rounded-md border border-[#10bc69]/20 bg-[#10bc69]/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#10bc69]">Current Staff</h2>
              <p className="text-sm text-muted-foreground">View and manage your existing staff members</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filter staff members..."
                  className="pl-8 border-[#10bc69]/30 focus-visible:ring-[#10bc69]/30"
                  value={staffSearchQuery}
                  onChange={handleStaffSearch}
                />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all-staff" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all-staff">All Staff</TabsTrigger>
              <TabsTrigger value="branch-managers">Branch Managers</TabsTrigger>
            </TabsList>

            <TabsContent value="all-staff">
              <StaffTable staff={filteredStaff} onAction={handleStaffAction} isBranchManagersView={false} />
            </TabsContent>

            <TabsContent value="branch-managers">
              <StaffTable staff={branchManagers} onAction={handleStaffAction} isBranchManagersView={true} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Add New Staff Section */}
        <div className="mt-8 rounded-md border border-gray-200 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Add New Staff</h2>
              <p className="text-sm text-muted-foreground">Search for users and add them to your staff</p>
            </div>
            
            <Button 
              onClick={() => {
                setShowAddForm(false);
                setUserSearchResults([]);
                setUserSearchQuery('');
              }}
              variant="outline"
              className="border-[#10bc69] text-[#10bc69] hover:bg-[#10bc69]/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Search
            </Button>
          </div>
          
          {/* Form to select role and branch */}
          {showAddForm && selectedUser && (
            <div className="rounded-md border border-[#10bc69]/20 bg-[#10bc69]/5 p-4">
              <h3 className="mb-4 text-lg font-medium text-[#10bc69]">Add {selectedUser.name} to Staff</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Role</label>
                    <Select 
                      value={selectedRoleId?.toString() || ""} 
                      onValueChange={(value) => setSelectedRoleId(Number(value))}
                    >
                      <SelectTrigger className="border-[#10bc69]/30 focus:ring-[#10bc69]/30">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Branch</label>
                    <Select 
                      value={selectedBranchId?.toString() || ""} 
                      onValueChange={(value) => setSelectedBranchId(Number(value))}
                    >
                      <SelectTrigger className="border-[#10bc69]/30 focus:ring-[#10bc69]/30">
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddStaff} 
                    disabled={isLoading || !selectedRoleId || !selectedBranchId}
                    className="bg-[#10bc69] hover:bg-[#10bc69]/90"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-1 h-4 w-4" />
                    )}
                    Add to Staff
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Search results for adding new staff */}
          {userSearchResults.length > 0 && !showAddForm && (
            <div className="rounded-md border p-4">
              <h3 className="mb-4 text-lg font-medium">Search Results</h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {userSearchResults.map((user) => (
                  <div key={user.id} className="flex flex-col rounded-md border p-4 transition-all hover:border-[#10bc69]/50 hover:shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#10bc69]/10 flex items-center justify-center text-[#10bc69]">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleSelectUser(user)} 
                      disabled={isLoading}
                      className="mt-auto bg-[#10bc69] hover:bg-[#10bc69]/90"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Select User
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Search form for adding new staff */}
          {userSearchResults.length === 0 && !showAddForm && (
            <div className="rounded-md bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-[#10bc69] opacity-80 mb-4" />
              <h3 className="mb-2 text-lg font-medium">Find Users to Add as Staff</h3>
              <p className="mb-4 text-sm text-muted-foreground max-w-md mx-auto">
                Search for users by name or email to add them to your staff team
              </p>
              
              <div className="flex max-w-md mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email"
                    value={userSearchQuery}
                    onChange={handleUserSearchInputChange}
                    className="pl-10 border-r-0 rounded-r-none focus-visible:ring-[#10bc69]/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchUsers();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleSearchUsers} 
                  disabled={isLoading}
                  className="rounded-l-none bg-[#10bc69] hover:bg-[#10bc69]/90"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>
            </div>
          )}
          
          {/* No content needed here - tabs are already in the staff management section */}
        </div>
      </div>
    </DashboardLayout>
  )
}
