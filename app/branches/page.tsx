"use client"
import { Plus } from "lucide-react"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { BranchCard } from "@/components/features/cards/branch-card"
import { getBranches } from "@/lib/data-service"

export default function BranchesPage() {
  // Get branch data from the data service
  const branches = getBranches()

  const handleBranchAction = (action: string, branchId: string) => {
    console.log(`Action: ${action}, Branch ID: ${branchId}`)
    // In a real app, you would implement the action logic here
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="Branches"
            actions={
              <Button className="bg-primary-teal hover:bg-primary-teal/90">
                <Plus className="mr-2 h-4 w-4" />
                Add New Branch
              </Button>
            }
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} onAction={handleBranchAction} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
