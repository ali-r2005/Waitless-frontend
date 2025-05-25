"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Clock, Users, Calendar, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { queueService } from "@/lib/queue-service"
import { toast } from "@/components/ui/use-toast"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import type { Queue, CreateQueueFormValues } from "@/types/queue"

interface QueueCardProps {
  queue: Queue
  onAction?: (action: string, queueId: number | string) => void
}

// Define the schema for updating a queue
const updateQueueSchema = z.object({
  name: z.string().min(2, { message: "Queue name must be at least 2 characters" }),
  scheduled_date: z.string().min(1, { message: "Date is required" }),
  start_time: z.string().min(1, { message: "Start time is required" }),
  is_active: z.boolean(),
})

export function QueueCard({ queue, onAction }: QueueCardProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Initialize form for updating a queue
  const form = useForm<z.infer<typeof updateQueueSchema>>({
    resolver: zodResolver(updateQueueSchema),
    defaultValues: {
      name: queue.name,
      scheduled_date: queue.scheduled_date,
      start_time: queue.start_time,
      is_active: queue.is_active,
    },
  })
  
  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, queue.id)
    }
  }
  
  // Handle queue update
  const handleUpdateQueue = async (data: z.infer<typeof updateQueueSchema>) => {
    setIsUpdating(true)
    try {
      // Format the data to match the API requirements based on documentation
      // The API expects: name, scheduled_date, is_active, start_time, preferences
      
      // Convert start_time from HH:MM format to H:i format as required by backend
      let formattedStartTime = data.start_time;
      if (formattedStartTime) {
        // Extract hours and minutes from the time string (HH:MM)
        const [hours, minutes] = formattedStartTime.split(':');
        // Format as H:i (remove leading zeros from hours)
        formattedStartTime = `${parseInt(hours, 10)}:${minutes}`;
      }
      
      // Create the payload exactly as expected by the API
      const queueData: Partial<CreateQueueFormValues> = {
        name: data.name.trim(),
        scheduled_date: data.scheduled_date,
        is_active: data.is_active,
        start_time: formattedStartTime,
        preferences: null, // Include this as it's in the API documentation
      }
      
      console.log('Sending update data:', queueData)
      
      // Call the API to update the queue
      const response = await queueService.updateQueue(queue.id.toString(), queueData)
      console.log('Update response:', response)
      
      // Close the dialog
      setIsUpdateDialogOpen(false)
      
      // Show success toast with the message from the API if available
      toast({
        title: "Success",
        description: response?.data?.message || "Queue updated successfully",
        className: "bg-waitless-green text-white",
      })
      
      // Refresh the page
      router.refresh()
    } catch (error: any) {
      console.error('Error updating queue:', error)
      
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
        toast({
          title: "Error",
          description: error.message || "Failed to update queue",
          variant: "destructive",
        })
      }
    } finally {
      setIsUpdating(false)
    }
  }
  
  // Handle queue deletion
  const handleDeleteQueue = async () => {
    setIsDeleting(true)
    try {
      // Call the API to delete the queue
      const response = await queueService.deleteQueue(queue.id.toString())
      console.log('Delete response:', response)
      
      // Show success toast with the message from the API if available
      toast({
        title: "Success",
        description: response?.data?.message || "Queue deleted successfully",
        className: "bg-waitless-green text-white",
      })
      
      // Refresh the page to show the updated queue list
      router.refresh()
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
    }
  }

  // Format date and time for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString: string) => {
    try {
      // If it's a full datetime string, extract just the time portion
      if (timeString.includes('T')) {
        const date = new Date(timeString)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      // Otherwise, assume it's just a time string
      return timeString
    } catch (error) {
      return timeString
    }
  }

  // Determine queue status badge
  const getStatusBadge = () => {
    if (queue.is_active) {
      return <Badge className="bg-waitless-green">Active</Badge>
    } else {
      return <Badge variant="outline">Inactive</Badge>
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
              <span className="truncate">{queue.name}</span>
              {getStatusBadge()}
            </CardTitle>
            <CardDescription className="truncate">
              {queue.branch?.name || "No branch assigned"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleAction("manage")}>Manage Queue</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("edit")}>Edit Queue</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("toggle")}>
                {queue.is_active ? "Deactivate Queue" : "Activate Queue"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => handleAction("delete")}>
                Delete Queue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex flex-wrap items-center gap-1">
            <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground whitespace-nowrap">Date:</p>
            <p className="font-medium truncate">{formatDate(queue.scheduled_date)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground whitespace-nowrap">Start Time:</p>
            <p className="font-medium truncate">{formatTime(queue.start_time)}</p>
          </div>
          <div className="col-span-1 sm:col-span-2 flex items-center gap-1 mt-2">
            <Users className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground whitespace-nowrap">Customers:</p>
            <p className="font-medium">{queue.users?.length || 0}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t bg-muted/50 px-4 sm:px-6 py-3">
        <div className="flex flex-row justify-between gap-2">
          <Link href={`/queue/add-customer?queueId=${queue.id}`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full">
              <Users className="mr-1 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
          <Link href={`/queue/manage/${queue.id}`} className="w-full sm:w-auto">
            <Button size="sm" className="w-full bg-waitless-green hover:bg-waitless-green/90 text-white">
              Manage Queue
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-row justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-1/2"
            onClick={() => setIsUpdateDialogOpen(true)}
          >
            <Edit className="mr-1 h-4 w-4" />
            Update Queue
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-1/2 text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete Queue
          </Button>
        </div>
      </CardFooter>
      
      {/* Update Queue Modal */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Queue</DialogTitle>
            <DialogDescription>
              Update the queue details below.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = form.getValues();
                handleUpdateQueue(formData as z.infer<typeof updateQueueSchema>);
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
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Queue</FormLabel>
                      <FormDescription>
                        Set the queue as active or inactive
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
                  onClick={() => setIsUpdateDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-waitless-green hover:bg-waitless-green/90 text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Queue"
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
              onClick={(e) => {
                e.preventDefault()
                handleDeleteQueue()
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Queue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
