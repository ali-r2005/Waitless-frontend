"use client"
import { Plus, Building2, Search, Loader2, Eye, Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Swal from "sweetalert2"

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
import { Input } from "@/components/ui/input"

// Animation variants for the branch cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Animation for page elements
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([])
  const [searchQuery, setSearchQuery] = useState("")
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
        setFilteredBranches(data)
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

  // Filter branches based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBranches(branches)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredBranches(
        branches.filter(
          branch => 
            branch.name.toLowerCase().includes(query) || 
            branch.address.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, branches])

  const handleCreateBranch = async (data: any) => {
    setIsSubmitting(true)
    try {
      await branchService.createBranch(data)
      await fetchBranches()
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Branch created successfully",
        className: "bg-[#10bc69] text-white",
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
        className: "bg-[#10bc69] text-white",
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
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        html: 'This action will <b>permanently delete</b> this branch and cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'custom-confirm-btn',
          cancelButton: 'custom-cancel-btn',
          popup: 'custom-modal'
        },
        buttonsStyling: false,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        backdrop: `
          rgba(0,0,0,0.4)
          url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff4b4b' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")
        `
      });

      if (result.isConfirmed) {
        await branchService.deleteBranch(branchId);
        await fetchBranches();
        
        // Show success message
        await Swal.fire({
          title: 'Deleted!',
          html: 'The branch has been successfully deleted.',
          icon: 'success',
          customClass: {
            confirmButton: 'custom-confirm-btn',
            popup: 'custom-modal'
          },
          buttonsStyling: false,
          timer: 2000,
          timerProgressBar: true
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        html: 'Failed to delete the branch. Please try again.',
        icon: 'error',
        customClass: {
          confirmButton: 'custom-confirm-btn',
          popup: 'custom-modal'
        },
        buttonsStyling: false
      });
    }
  };

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

  const openCreateDialog = () => {
    setSelectedBranch(undefined)
    setIsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div 
          className="flex-1 space-y-6 p-6 md:p-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Page Header with Title and Actions */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100/60 dark:border-gray-700/60"
            variants={fadeInUp}
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#10bc69] to-blue-500 dark:from-[#10bc69] dark:to-blue-400 bg-clip-text text-transparent">
                Branch Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage all your business locations from one place
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#10bc69]" />
                <Input 
                  placeholder="Search branches..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-[260px] rounded-lg border-gray-200 dark:border-gray-700 focus:border-[#10bc69] focus:ring-[#10bc69] bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm h-11"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <Button 
                  onClick={openCreateDialog}
                  className="cssbuttons-io-button flex items-center h-11 rounded-lg"
                  >
                    Add New Branch
                  <div className="icon">
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  </Button>
                <AnimatePresence>
                  {isDialogOpen && (
                    <DialogContent className="sm:max-w-[500px] bg-gray-900 border-none shadow-2xl rounded-2xl overflow-hidden p-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                      >
                        <button 
                          onClick={() => setIsDialogOpen(false)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-white z-20"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        
                        <div className="bg-gray-800/80 p-6 relative z-10">
                  <DialogHeader>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                              className="relative"
                            >
                              <DialogTitle className="text-2xl font-bold text-[#10bc69]">
                                {selectedBranch ? "Edit Branch" : "Create New Branch"}
                              </DialogTitle>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2, duration: 0.4 }}
                            >
                              <DialogDescription className="text-gray-400">
                      {selectedBranch 
                        ? "Update the branch details below"
                        : "Fill in the details below to create a new branch"}
                    </DialogDescription>
                            </motion.div>
                  </DialogHeader>
                        </div>
                        
                        <div className="p-6 bg-gray-900 relative z-10">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                          >
                  <BranchForm
                    initialData={selectedBranch}
                    branches={branches}
                    onSubmit={selectedBranch ? handleUpdateBranch : handleCreateBranch}
                    isLoading={isSubmitting}
                  />
                          </motion.div>
                        </div>
                      </motion.div>
                </DialogContent>
                  )}
                </AnimatePresence>
              </Dialog>
            </div>
          </motion.div>

          {/* Branch Count Summary */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            <div className="flex items-center p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 hover:shadow-md hover:shadow-[#10bc69]/10 hover:-translate-y-1 transition-all duration-300">
              <div className="rounded-full bg-gradient-to-br from-[#10bc69]/20 to-blue-500/20 p-3 mr-4">
                <Building2 className="h-6 w-6 text-[#10bc69]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Branches</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#10bc69] to-blue-500 bg-clip-text text-transparent">{filteredBranches.length}</p>
              </div>
            </div>
          </motion.div>

          {/* Branch Cards */}
          {isLoading ? (
            <motion.div 
              variants={fadeInUp}
              className="flex justify-center items-center h-64"
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-[#10bc69] animate-spin" />
                <p className="text-gray-500 dark:text-gray-400">Loading branches...</p>
            </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              variants={fadeInUp}
              className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-8 text-center"
            >
              <div className="inline-block p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">{error}</h3>
              <Button 
                onClick={() => {
                  setIsLoading(true)
                  setError(null)
                  fetchBranches()
                }}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBranches.length > 0 ? (
                filteredBranches.map((branch, index) => (
                  <motion.div key={branch.id} variants={cardVariants} custom={index}>
                    <BranchCard branch={branch} onAction={handleBranchAction} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  variants={fadeInUp} 
                  className="col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100/60 dark:border-gray-700/60 rounded-2xl p-12 text-center"
                >
                  <div className="inline-block p-4 bg-gradient-to-br from-[#10bc69]/10 to-blue-500/10 rounded-full mb-4">
                    <Building2 className="h-10 w-10 text-[#10bc69]" />
                </div>
                  {searchQuery ? (
                    <>
                      <h3 className="text-lg font-medium mb-2">No branches found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No branches match your search query. Try a different search term.
                      </p>
                      <Button 
                        onClick={() => setSearchQuery("")}
                        className="bg-[#10bc69] hover:bg-[#0f9a58] text-white"
                      >
                        Clear Search
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-2">No branches yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Get started by creating your first branch.
                      </p>
                      <Button 
                        onClick={openCreateDialog}
                        className="bg-gradient-to-br from-[#10bc69] to-blue-500 hover:from-[#0f9a58] hover:to-blue-600 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Branch
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          <AnimatePresence>
          {viewingBranchId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
            <BranchDetails
              branchId={viewingBranchId}
              isOpen={true}
              onClose={() => setViewingBranchId(null)}
            />
              </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
