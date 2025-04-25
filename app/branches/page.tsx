"use client"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { BranchCard } from "@/components/features/cards/branch-card"
import { branchService } from "@/lib/branch-service"
import type { Branch } from "@/types/branch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BranchForm } from "@/components/forms/branch-form"
import { toast } from "@/components/ui/use-toast"
import { BranchDetails } from "@/components/features/branch-details"

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewingBranchId, setViewingBranchId] = useState<number | null>(null)

  const fetchBranches = async () => {
    try {
      const data = await branchService.getBranches()
      console.log('Received branches data:', data)
      
      if (Array.isArray(data)) {
        setBranches(data)
      } else {
        console.error('Invalid branches data format:', data)
        setError('Received invalid data format from server')
      }
    } catch (err) {
      console.error('Error details:', err)
      setError("Failed to load branches. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  const handleCreateBranch = async (data: any) => {
    setIsSubmitting(true)
    try {
      await branchService.createBranch(data)
      await fetchBranches()
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Branch created successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create branch",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateBranch = async (data: any) => {
    if (!selectedBranch) return
    setIsSubmitting(true)
    try {
      await branchService.updateBranch(selectedBranch.id, data)
      await fetchBranches()
      setIsDialogOpen(false)
      setSelectedBranch(undefined)
      toast({
        title: "Success",
        description: "Branch updated successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update branch",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBranch = async (branchId: number) => {
    if (!confirm("Are you sure you want to delete this branch?")) return
    try {
      await branchService.deleteBranch(branchId)
      await fetchBranches()
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      })
    }
  }

  const handleBranchAction = async (action: string, branchId: number) => {
    switch (action) {
      case "view":
        setViewingBranchId(branchId)
        break
      case "edit":
        const branch = branches.find(b => b.id === branchId)
        setSelectedBranch(branch)
        setIsDialogOpen(true)
        break
      case "delete":
        await handleDeleteBranch(branchId)
        break
      default:
        console.log(`Action: ${action}, Branch ID: ${branchId}`)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="Branches"
            actions={
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-primary-teal hover:bg-primary-teal/90"
                    onClick={() => setSelectedBranch(undefined)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Branch
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedBranch ? "Edit Branch" : "Create New Branch"}</DialogTitle>
                    <DialogDescription>
                      {selectedBranch 
                        ? "Update the branch details below"
                        : "Fill in the details below to create a new branch"}
                    </DialogDescription>
                  </DialogHeader>
                  <BranchForm
                    initialData={selectedBranch}
                    branches={branches}
                    onSubmit={selectedBranch ? handleUpdateBranch : handleCreateBranch}
                    isLoading={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            }
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-teal"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(branches) && branches.length > 0 ? (
                branches.map((branch) => (
                  <BranchCard key={branch.id} branch={branch} onAction={handleBranchAction} />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  No branches found
                </div>
              )}
            </div>
          )}

          {viewingBranchId && (
            <BranchDetails
              branchId={viewingBranchId}
              isOpen={true}
              onClose={() => setViewingBranchId(null)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
