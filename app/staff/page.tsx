"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/ui/page-header"
import { StaffTable } from "@/components/features/tables/staff-table"
import { StaffRequestsTable } from "@/components/features/tables/staff-requests-table"
import { getStaffMembers, getPendingStaffRequests } from "@/lib/data-service"

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Get staff data from the data service
  const staff = getStaffMembers()
  const pendingRequests = getPendingStaffRequests()

  // Filter staff based on search query
  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.branch.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStaffAction = (action: string, staffId: string) => {
    console.log(`Action: ${action}, Staff ID: ${staffId}`)
    // In a real app, you would implement the action logic here
  }

  const handleApproveRequest = (requestId: string) => {
    console.log(`Approve request: ${requestId}`)
    // In a real app, you would implement the approval logic here
  }

  const handleRejectRequest = (requestId: string) => {
    console.log(`Reject request: ${requestId}`)
    // In a real app, you would implement the rejection logic here
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="Staff Management"
            actions={
              <Button className="bg-primary-teal hover:bg-primary-teal/90">
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all-staff" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all-staff">All Staff</TabsTrigger>
              <TabsTrigger value="branch-managers">Branch Managers</TabsTrigger>
              <TabsTrigger value="pending-requests">
                Pending Requests
                <Badge className="ml-2 bg-primary-teal text-primary-foreground">{pendingRequests.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-staff">
              <StaffTable staff={filteredStaff} onAction={handleStaffAction} />
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
