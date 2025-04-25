"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Building2, Calendar, Clock, MapPin, Share2, Store } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { branchService } from "@/lib/branch-service"
import type { Branch } from "@/types/branch"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BranchDetailsProps {
  branchId: number
  isOpen: boolean
  onClose: () => void
}

export function BranchDetails({ branchId, isOpen, onClose }: BranchDetailsProps) {
  const [branch, setBranch] = useState<Branch | null>(null)
  const [hierarchy, setHierarchy] = useState<Branch | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranchDetails = async () => {
      if (!branchId) return
      setIsLoading(true)
      setError(null)
      
      try {
        // First try to get the branch details
        const branchData = await branchService.getBranchById(branchId)
        console.log('Fetched branch data:', branchData)
        setBranch(branchData)

        // Then try to get the hierarchy
        try {
          const hierarchyData = await branchService.getBranchHierarchy(branchId)
          console.log('Fetched hierarchy data:', hierarchyData)
          setHierarchy(hierarchyData)
        } catch (hierarchyError) {
          console.error('Error fetching hierarchy:', hierarchyError)
          // Don't set the main error - hierarchy is optional
        }
      } catch (err) {
        console.error('Error fetching branch details:', err)
        setError("Failed to load branch details")
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchBranchDetails()
    }
  }, [branchId, isOpen])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "PPpp")
    } catch (err) {
      console.error('Error formatting date:', dateString, err)
      return dateString
    }
  }

  const renderHierarchy = (branch: Branch | null, level = 0) => {
    if (!branch) return null

    return (
      <div key={branch.id} className="space-y-2">
        <div
          className="flex items-center gap-2 text-sm"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span className={level === 0 ? "font-medium" : ""}>
            {branch.name}
          </span>
          <span className="text-muted-foreground text-xs">
            ({branch.address})
          </span>
        </div>
        {branch.children?.map((child) => renderHierarchy(child, level + 1))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>Branch Details</DialogTitle>
          <DialogDescription>
            Detailed information about the branch and its hierarchy
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-teal"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : branch ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium min-w-[100px]">Name:</span>
                  <span className="text-primary">{branch.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium min-w-[100px]">Address:</span>
                  <span className="text-primary">{branch.address || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium min-w-[100px]">Business ID:</span>
                  <span className="text-primary">{branch.business_id || 'N/A'}</span>
                </div>
                {branch.parent_id !== null && (
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium min-w-[100px]">Parent Branch:</span>
                    <span className="text-primary">{branch.parent_id}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timestamps</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium min-w-[100px]">Created:</span>
                  <span className="text-primary">{formatDate(branch.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium min-w-[100px]">Last Updated:</span>
                  <span className="text-primary">{formatDate(branch.updated_at)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Branch Hierarchy */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Branch Hierarchy</h3>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                {hierarchy ? (
                  renderHierarchy(hierarchy)
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No hierarchy information available
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-4">
            No branch information found
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 