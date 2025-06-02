"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, Plus, Search, Users, Filter, Loader2, Calendar, Clock } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/ui/page-header"
import { QueueCard } from "@/components/features/cards/queue-card"
import { queueService } from "@/lib/queue-service"
import { branchService } from "@/lib/branch-service"
import { useAuth } from "@/lib/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Queue, CreateQueueFormValues } from "@/types/queue"
import { Branch } from "@/types/branch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define the schema for queue form (create/update)
const queueFormSchema = z.object({
  name: z.string().min(2, { message: "Queue name must be at least 2 characters" }),
  scheduled_date: z.string().min(1, { message: "Date is required" }),
  start_time: z.string().min(1, { message: "Start time is required" }),
  is_active: z.boolean(),
  branch_id: z.string().optional(),
  id: z.string().optional() // For update operations
})

// Define the type for form values
type QueueFormValues = z.infer<typeof queueFormSchema>

export default function QueuePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeQueues, setActiveQueues] = useState<Queue[]>([])
  const [allQueues, setAllQueues] = useState<Queue[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("all") 
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "update">("create")
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const isBusinessOwner = user?.role?.toLowerCase() === "business_owner"
  const isBranchManager = user?.role?.toLowerCase() === "branch_manager"
  const isStaff = user?.role?.toLowerCase() === "staff"
  
  // Check if the user has permission to perform actions on a specific queue
  const hasQueueActionPermission = (queue: Queue) => {
    // Business owner should not see queue actions
    if (isBusinessOwner) return false
    
    // Branch manager and staff can only manage queues assigned to them
    if ((isBranchManager || isStaff) && queue.staff_id) {
      return queue.staff_id.toString() === user?.staff?.id?.toString()
    }
    
    return false
  }
  
  // Check if user can add new queues (only branch managers)
  const canAddQueue = isBranchManager

  // Fetch queues and branches
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch branches if user is a business owner
        if (isBusinessOwner) {
          const branchesData = await branchService.getBranches()
          setBranches(branchesData)
        }
        
        // Fetch queues based on selected branch
        await fetchQueues()
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [isBusinessOwner])
  
  // Fetch queues when selected branch changes
  useEffect(() => {
    if (!isLoading) {
      fetchQueues()
    }
  }, [selectedBranch])
  
  // Function to fetch queues with optional branch filter
  const fetchQueues = async () => {
    setIsLoading(true)
    try {
      // Prepare params for API call
      const params: { branch_id?: string } = {}
      if (selectedBranch && selectedBranch !== 'all') {
        params.branch_id = selectedBranch
      }
      
      // Fetch queues with params
      const queuesResponse = await queueService.getQueues(params)
      if (queuesResponse.data?.data) {
        const fetchedQueues = queuesResponse.data.data
        setAllQueues(fetchedQueues)
        
        // Filter active queues
        const active = fetchedQueues.filter(queue => queue.is_active)
        setActiveQueues(active)
      }
    } catch (error) {
      console.error("Error fetching queues:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize form for queue operations (create/update)
  const form = useForm<QueueFormValues>({
    resolver: zodResolver(queueFormSchema),
    defaultValues: {
      name: "",
      scheduled_date: format(new Date(), "yyyy-MM-dd"),
      start_time: "09:00",
      is_active: true,
      branch_id: "",
      id: ""
    }
  })

  // Handle form submission for queue operations (create/update)
  const handleSubmitQueue = async (values: QueueFormValues) => {
    setIsSubmitting(true)
    try {
      // Format the start_time from HH:MM format to H:i format as required by backend
      let formattedStartTime = values.start_time;
      if (formattedStartTime) {
        // Extract hours and minutes from the time string (HH:MM)
        const [hours, minutes] = formattedStartTime.split(':');
        // Format as H:i (remove leading zeros from hours)
        formattedStartTime = `${parseInt(hours, 10)}:${minutes}`;
      }
      
      // Create a properly typed object with only the required fields
      const queueData: CreateQueueFormValues = {
        name: values.name.trim(),
        scheduled_date: values.scheduled_date,
        is_active: values.is_active,
        start_time: formattedStartTime,
        preferences: null
      }
      
      // Only add branch_id if it's provided and not empty
      if (values.branch_id && values.branch_id !== "") {
        queueData.branch_id = parseInt(values.branch_id)
      }
      
      let response;
      if (formMode === "create") {
        console.log('Creating queue with data:', queueData)
        response = await queueService.createQueue(queueData)
      } else {
        console.log('Updating queue with data:', queueData)
        response = await queueService.updateQueue(selectedQueue?.id.toString() || "", queueData)
      }
      
      console.log('API response:', response)
      
      // Close the dialog first to improve user experience
      setIsDialogOpen(false)
      
      // Reset the form
      form.reset()
      
      // Refresh the queue list
      await fetchQueues()
      
      // Show success message
      toast({
        title: "Success",
        description: formMode === "create" ? "Queue created successfully" : "Queue updated successfully",
        className: "bg-waitless-green text-white",
      })
    } catch (error: any) {
      console.error(`Error ${formMode === "create" ? "creating" : "updating"} queue:`, error)
      
      // Handle validation errors specifically
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors || {}
        console.log('Validation errors:', validationErrors)
        
        // Show specific validation errors if available
        const errorMessage = Object.values(validationErrors)
          .flat()
          .join('\n')
        
        toast({
          title: "Validation Error",
          description: errorMessage || "Please check your input and try again",
          variant: "destructive",
        })
      } else {
        // Show error toast
        toast({
          title: "Error",
          description: error.message || `Failed to ${formMode === "create" ? "create" : "update"} queue`,
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle queue deletion
  const handleDeleteQueue = async () => {
    if (!selectedQueue) return;
    
    setIsDeleting(true)
    try {
      // Call the API to delete the queue
      const response = await queueService.deleteQueue(selectedQueue.id.toString())
      console.log('Delete response:', response)
      
      // Show success toast with the message from the API if available
      toast({
        title: "Success",
        description: response?.data?.message || "Queue deleted successfully",
        className: "bg-waitless-green text-white",
      })
      
      // Refresh the queue list
      await fetchQueues()
    } catch (error: any) {
      console.error('Error deleting queue:', error)
      
      // Handle different error types
      if (error.response) {
        // The request was made and the server responded with an error status
        const errorMessage = error.response.data?.message || "Failed to delete queue"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } else {
        // Something else went wrong
        toast({
          title: "Error",
          description: error.message || "Failed to delete queue",
          variant: "destructive",
        })
      }
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setSelectedQueue(null)
    }
  }

  // Handle dialog open for create
  const openCreateDialog = () => {
    setFormMode("create")
    // Reset form and set branch_id if a branch is selected
    form.reset({
      name: "",
      scheduled_date: format(new Date(), "yyyy-MM-dd"),
      start_time: "09:00",
      is_active: true,
      branch_id: selectedBranch !== "all" ? selectedBranch : "",
      id: ""
    })
    setIsDialogOpen(true)
  }

  // Handle dialog open for update
  const openUpdateDialog = (queue: Queue) => {
    setFormMode("update")
    setSelectedQueue(queue)
    // Set form values from the selected queue
    form.reset({
      name: queue.name,
      scheduled_date: queue.scheduled_date,
      start_time: queue.start_time,
      is_active: queue.is_active,
      branch_id: queue.branch_id ? queue.branch_id.toString() : "",
      id: queue.id.toString()
    })
    setIsDialogOpen(true)
  }

  // Handle opening delete confirmation dialog
  const openDeleteDialog = (queue: Queue) => {
    setSelectedQueue(queue)
    setIsDeleteDialogOpen(true)
  }

  // Handle queue filtering
  const handleBranchFilter = (branchId: string) => {
    setSelectedBranch(branchId)
    // Note: No need to call fetchQueues() here as it will be triggered by the useEffect
  }

  // Filter queues based on search query only (branch filtering is done server-side)
  const getFilteredActiveQueues = () => {
    if (!searchQuery.trim()) {
      return activeQueues;
    }
    
    return activeQueues.filter(queue => {
      const matchesSearch = 
        queue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (queue.branch?.name && queue.branch.name.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesSearch
    })
  }

  const getFilteredAllQueues = () => {
    if (!searchQuery.trim()) {
      return allQueues;
    }
    
    return allQueues.filter(queue => {
      const matchesSearch = 
        queue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (queue.branch?.name && queue.branch.name.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesSearch
    })
  }

  const handleQueueAction = (action: string, queueId: number | string) => {
    console.log(`Action: ${action}, Queue ID: ${queueId}`)
    
    // Find the queue by ID
    const queue = [...allQueues].find(q => q.id.toString() === queueId.toString())
    if (!queue) {
      console.error(`Queue with ID ${queueId} not found`)
      return
    }
    
    // Handle different actions
    switch (action) {
      case "edit":
        openUpdateDialog(queue)
        break
      case "delete":
        openDeleteDialog(queue)
        break
      case "manage":
        router.push(`/queue/manage/${queueId}`)
        break
      case "add-customer":
        // Navigate to add customer page
        router.push(`/queue/${queueId}/add-customer`)
        break
      case "toggle":
        // Toggle queue active status
        handleToggleQueueStatus(queue)
        break
      default:
        console.log(`Unhandled action: ${action}`)
    }
  }
  
  // Handle toggling queue active status
  const handleToggleQueueStatus = async (queue: Queue) => {
    try {
      const newStatus = !queue.is_active
      await queueService.activateQueue(queue.id.toString(), newStatus)
      
      // Show success message
      toast({
        title: "Success",
        description: `Queue ${newStatus ? "activated" : "deactivated"} successfully`,
        className: "bg-waitless-green text-white",
      })
      
      // Refresh queues
      await fetchQueues()
    } catch (error: any) {
      console.error('Error toggling queue status:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update queue status",
        variant: "destructive",
      })
    }
  }

  const filteredActiveQueues = getFilteredActiveQueues()
  const filteredAllQueues = getFilteredAllQueues()

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="Queue Management"
            actions={
              canAddQueue ? (
                <Button variant="outline" onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Queue
                </Button>
              ) : null
            }
          />

          <Tabs defaultValue="active-queues" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active-queues">Active Queues</TabsTrigger>
              <TabsTrigger value="queue-history">Queue History</TabsTrigger>
            </TabsList>

            <TabsContent value="active-queues">
              <div className="flex items-center gap-4 pb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search queues..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {isBusinessOwner && branches.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedBranch} onValueChange={handleBranchFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="col-span-3 rounded-md border p-8 text-center">
                  <p className="text-muted-foreground">Loading queues...</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredActiveQueues.map((queue) => (
                    <QueueCard 
                      key={queue.id} 
                      queue={queue} 
                      onAction={hasQueueActionPermission(queue) ? handleQueueAction : undefined} 
                    />
                  ))}

                  {filteredActiveQueues.length === 0 && (
                    <div className="col-span-3 rounded-md border p-8 text-center">
                      <p className="text-muted-foreground">No active queues found matching your criteria.</p>
                      {(searchQuery || selectedBranch) && (
                        <Button 
                          variant="outline" 
                          className="mt-4 border-waitless-green text-waitless-green hover:bg-waitless-green hover:text-white" 
                          onClick={() => {
                            setSearchQuery("")
                            setSelectedBranch("")
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="queue-history">
              <div className="flex items-center gap-4 pb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search all queues..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {isBusinessOwner && branches.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedBranch} onValueChange={handleBranchFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {isLoading ? (
                <div className="col-span-3 rounded-md border p-8 text-center">
                  <p className="text-muted-foreground">Loading queues...</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAllQueues.map((queue) => (
                    <QueueCard 
                      key={queue.id} 
                      queue={queue} 
                      onAction={hasQueueActionPermission(queue) ? handleQueueAction : undefined} 
                    />
                  ))}

                  {filteredAllQueues.length === 0 && (
                    <div className="col-span-3 rounded-md border p-8 text-center">
                      <p className="text-muted-foreground">No queues found matching your criteria.</p>
                      {(searchQuery || selectedBranch) && (
                        <Button 
                          variant="outline" 
                          className="mt-4 border-waitless-green text-waitless-green hover:bg-waitless-green hover:text-white" 
                          onClick={() => {
                            setSearchQuery("")
                            setSelectedBranch("")
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Queue Form Modal (Create/Update) */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{formMode === "create" ? "Create New Queue" : "Update Queue"}</DialogTitle>
                <DialogDescription>
                  {formMode === "create" 
                    ? "Fill in the details to create a new queue for your customers."
                    : "Update the queue details below."}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = form.getValues();
                    handleSubmitQueue(formData);
                  }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Queue Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer Service Queue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scheduled_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="time" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {branches.length > 0 && (
                    <FormField
                      control={form.control}
                      name="branch_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id.toString()}>
                                  {branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Queue</FormLabel>
                          <FormDescription>
                            {formMode === "create"
                              ? "Set the queue as active immediately after creation"
                              : "Set the queue as active or inactive"}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-waitless-green hover:bg-waitless-green/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {formMode === "create" ? "Creating..." : "Updating..."}
                        </>
                      ) : (
                        formMode === "create" ? "Create Queue" : "Update Queue"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {/* Delete Queue Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this queue?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the queue
                  and all associated customer data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    handleDeleteQueue()
                  }}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Queue"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </DashboardLayout>
  )
}
