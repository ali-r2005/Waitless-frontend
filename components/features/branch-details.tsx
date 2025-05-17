"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Building2, Calendar, Clock, MapPin, Share2, Store, X } from "lucide-react"

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
import { motion, AnimatePresence } from "framer-motion"

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
          className={`flex items-center gap-2 text-sm cursor-pointer ${level === 0 ? "font-medium text-[#10bc69]" : "text-gray-700 dark:text-gray-300"}`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => {
            if (level === 0) return; // prevent reloading for root
            setBranch(branch)
            setHierarchy(branch)
          }}
        >
          <Share2 className="h-4 w-4 text-[#10bc69]" />
          <span>{branch.name}</span>
          <span className="text-gray-400 text-xs">({branch.address})</span>
        </div>
        {branch.children?.map((child) => renderHierarchy(child, level + 1))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1A1E2E] border-none shadow-2xl rounded-2xl p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-black dark:hover:text-white z-20"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="p-6">
                <DialogHeader className="pb-2">
                  <DialogTitle className="text-2xl font-bold text-[#10bc69]">
                    Branch Details
                  </DialogTitle>
                  <DialogDescription className="text-gray-500 dark:text-gray-400">
                    Detailed information about this branch
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10bc69]"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4 bg-red-100 dark:bg-red-900/20 rounded-lg">{error}</div>
                ) : branch ? (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div className="grid gap-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-[#10bc69]" />
                            <span className="text-[#10bc69] font-medium">Branch Name</span>
                          </div>
                          <div className="bg-gray-100 dark:bg-[#1e2338] p-3 rounded-lg text-gray-900 dark:text-white">
                            {branch.name || 'N/A'}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#10bc69]" />
                            <span className="text-[#10bc69] font-medium">Address</span>
                          </div>
                          <div className="bg-gray-100 dark:bg-[#1e2338] p-3 rounded-lg text-gray-900 dark:text-white">
                            {branch.address || 'N/A'}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-[#10bc69]" />
                            <span className="text-[#10bc69] font-medium">Parent Branch</span>
                          </div>
                          <div className="bg-gray-100 dark:bg-[#1e2338] p-3 rounded-lg text-gray-900 dark:text-white">
                            {hierarchy && hierarchy.name !== branch.name ? hierarchy.name : 'No Parent Branch'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Branch Hierarchy (if available) */}
                    {hierarchy && (
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Share2 className="h-5 w-5 text-[#10bc69]" />
                          <span className="text-[#10bc69] font-medium">Branch Hierarchy</span>
                        </div>
                        <ScrollArea className="h-[150px] rounded-lg bg-gray-100 dark:bg-[#1e2338] p-4">
                          {renderHierarchy(hierarchy)}
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No branch information found
                  </div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}