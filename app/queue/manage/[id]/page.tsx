"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import Link from "next/link"
import { Pause, Play, Search, UserPlus, Clock, User, MoreHorizontal, ArrowRight, Loader2, AlertTriangle } from "lucide-react"
import { useParams } from 'next/navigation'

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/ui/page-header"
import { QueueDashboard } from "@/components/sections/dashboards/queue-dashboard"
import { QueueCustomersTable } from "@/components/features/tables/queue-customers-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { queueService } from "@/lib/queue-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { QueueCustomer, ServedCustomer, QueueUpdate } from "@/types/queue"
import { getPrivateChannel } from "@/lib/pusher-service"

export default function ManageQueuePage() {
  // Unwrap params with React.use()
  const params = useParams();
  const id = params?.id as string;
  
  // State for queue data
  const [queue, setQueue] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for queue status
  const [queueState, setQueueState] = useState<'active' | 'paused' | 'inactive' | 'ready_to_call'>('inactive')
  const [searchQuery, setSearchQuery] = useState("")
  const [isCallNextDisabled, setIsCallNextDisabled] = useState(false)
  
  // State for customers
  const [waitingCustomers, setWaitingCustomers] = useState<QueueCustomer[]>([])
  const [servingCustomers, setServingCustomers] = useState<QueueCustomer[]>([])
  const [lateCustomers, setLateCustomers] = useState<QueueCustomer[]>([])
  const [servedCustomers, setServedCustomers] = useState<ServedCustomer[]>([])
  
  // Stats
  const [servedStats, setServedStats] = useState<{
    total_served: number;
    average_waiting_time: number;
    date: string;
  } | null>(null)
  
  // Computed values for backward compatibility
  const isQueueActive = queueState === 'active' || queueState === 'ready_to_call'
  const isQueuePaused = queueState === 'paused'
  
  // Filtered customers for search with truly unique keys
  const allCustomersInQueue = [...waitingCustomers, ...servingCustomers].filter(customer => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query) ||
      customer.service?.toLowerCase().includes(query)
    )
  }).map((customer, index) => {
    // Create a truly unique key by combining id, status, and index
    return {
      ...customer,
      uniqueKey: `${customer.id}-${customer.pivot?.status}-${index}`
    }
  })
  
  // Fetch queue details
  const fetchQueueDetails = async () => {
    setIsLoading(true)
    try {
      const response = await queueService.getQueueDetails(id)
      if (response.data?.data) {
        const queueData = response.data.data
        setQueue(queueData)
        
        // Set queue state based on active/paused status
        if (queueData.is_active) {
          setQueueState(queueData.is_paused ? 'paused' : 'active')
        } else {
          setQueueState('inactive')
        }
        
        // Process users based on their status in the pivot
        if (queueData.users && Array.isArray(queueData.users)) {
          updateCustomerGroups(queueData.users)
        }
      }
    } catch (err: any) {
      console.error('Error fetching queue details:', err)
      setError(err.message || 'Failed to load queue details')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Helper function to update customer groups
  const updateCustomerGroups = (users: any[]) => {
    if (!users || !Array.isArray(users)) return
    
    // Group customers by their status
    // Note: API may return 'serving' or 'being_served' depending on backend implementation
    const waiting = users.filter(user => user.pivot?.status === 'waiting')
      .map((user, index) => ({
        ...user,
        uniqueKey: `${user.id}-${user.pivot?.status}-${index}`
      }))
    
    const serving = users.filter(user => 
      user.pivot?.status === 'serving' || user.pivot?.status === 'being_served'
    ).map((user, index) => ({
      ...user,
      uniqueKey: `${user.id}-${user.pivot?.status}-${index}`
    }))
    
    const late = users.filter(user => user.pivot?.status === 'late')
      .map((user, index) => ({
        ...user,
        uniqueKey: `${user.id}-${user.pivot?.status}-${index}`
      }))
    
    setWaitingCustomers(waiting)
    setServingCustomers(serving)
    setLateCustomers(late)
  }
  
  // Fetch queue customers (for more efficient refreshes)
  const fetchQueueCustomers = async () => {
    try {
      const response = await queueService.getQueueCustomers(id)
      if (response.data?.data) {
        updateCustomerGroups(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching queue customers:', err)
    }
  }
  
  // Fetch served customers
  const fetchServedCustomers = async () => {
    try {
      const response = await queueService.getCustomersServedToday(id)
      if (response.data?.data) {
        const { served_customers, statistics } = response.data.data
        // Add unique keys to served customers
        const servedWithKeys = served_customers.map((customer, index) => ({
          ...customer,
          uniqueKey: `served-${customer.id}-${index}`
        }))
        setServedCustomers(servedWithKeys)
        setServedStats(statistics)
      }
    } catch (err) {
      console.error('Error fetching served customers:', err)
    }
  }
  
  // Fetch late customers
  const fetchLateCustomers = async () => {
    try {
      const response = await queueService.getLateCustomers(id)
      if (response.data?.data) {
        setLateCustomers(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching late customers:', err)
    }
  }
  
  // Fetch all data - optimized to avoid unnecessary fetches
  const fetchAllData = async () => {
    // Start with the main queue details which includes basic customer data
    await fetchQueueDetails()
    
    // Fetch additional data in parallel for better performance
    await Promise.all([
      fetchServedCustomers(),
      fetchLateCustomers()
    ])
  }
  
  // Set up real-time updates
  useEffect(() => {
    if (!id) return
    
    try {
      // Subscribe to private channel for this queue
      const channel = getPrivateChannel(`staff.queue.${id}`)
      
      // Listen for StaffQueueUpdate events
      channel.listen('.StaffQueueUpdate', (data: QueueUpdate) => {
        console.log('Real-time queue update:', data)
        
        // Handle updates in a more granular way to optimize performance
        const updates: Promise<any>[] = []
        
        // Update queue state if provided
        if (data.queue_state) {
          setQueueState(data.queue_state as 'active' | 'paused' | 'inactive' | 'ready_to_call')
        }
        
        // Handle specific update types efficiently
        if (data.queue?.is_active !== undefined || data.queue?.is_paused !== undefined) {
          // Only queue status changed, no need to refresh customers
          if (data.queue.is_active) {
            setQueueState(data.queue.is_paused ? 'paused' : 'active')
          } else {
            setQueueState('inactive')
          }
        }
        
        // If we have specific customer updates, use them directly
        if (data.customers && data.customers.length > 0) {
          // Only fetch customers if we don't have the full data in the update
          // Check if the customer data includes pivot information
          const hasDetailedData = data.customers.some(c => 'pivot' in c)
          if (!hasDetailedData) {
            updates.push(fetchQueueCustomers())
          } else {
            // Use the customer data from the update directly
            const allUsers = [...waitingCustomers, ...servingCustomers, ...lateCustomers]
            const updatedUsers = allUsers.map(user => {
              const updatedUser = data.customers?.find(c => c.id === user.id)
              return updatedUser ? { ...user, ...updatedUser } : user
            })
            updateCustomerGroups(updatedUsers)
          }
        }
        
        // Handle specific events
        if (data.customer_served) {
          updates.push(fetchServedCustomers())
        }
        
        if (data.customer_late) {
          updates.push(fetchLateCustomers())
        }
        
        // Execute all needed updates in parallel
        if (updates.length > 0) {
          Promise.all(updates).catch(err => {
            console.error('Error processing real-time updates:', err)
          })
        }
      })
      
      // Clean up subscription on unmount
      return () => {
        channel.stopListening('.StaffQueueUpdate')
        if (typeof window !== 'undefined' && window.Echo) {
          window.Echo.leave(`staff.queue.${id}`)
        }
      }
    } catch (error) {
      console.error('Failed to subscribe to queue updates:', error)
      return () => {} // Return empty cleanup function
    }
  }, [id])
  
  // Initial data fetch
  useEffect(() => {
    fetchAllData()
  }, [id])
  
  // Toggle queue active/inactive state
  const toggleQueueStatus = async () => {
    try {
      // Determine the new active state (opposite of current)
      const newIsActive = !isQueueActive
      
      const response = await queueService.activateQueue(id, newIsActive)
      
      if (response.data?.status === 'success') {
        toast({
          title: newIsActive ? 'Queue Activated' : 'Queue Deactivated',
          description: newIsActive ? 
            'The queue is now active and customers can be served.' : 
            'The queue has been deactivated. No customers can be served.',
          variant: "default"
        })
        
        // Update the queue state
        setQueueState(newIsActive ? 'active' : 'inactive')
        
        // Refresh the queue details
        fetchQueueDetails()
      }
    } catch (err: any) {
      console.error('Error toggling queue status:', err)
      toast({
        title: 'Action Failed',
        description: err.message || 'Failed to update queue status',
        variant: "destructive"
      })
    }
  }
  
  // Toggle queue paused/resumed state
  const toggleQueuePaused = async () => {
    if (queueState === 'inactive') {
      toast({
        title: "Queue inactive",
        description: "You need to activate the queue first",
        variant: "destructive"
      })
      return
    }
    
    try {
      // If paused, resume. If running, pause.
      if (queueState === 'paused') {
        await queueService.resumeQueue(id)
        setQueueState('active')
        toast({
          title: "Queue resumed",
          description: "Customers can now be served"
        })
      } else {
        await queueService.pauseQueue(id)
        setQueueState('paused')
        toast({
          title: "Queue paused",
          description: "The queue is temporarily paused"
        })
      }
      
      // Refresh queue data
      fetchQueueDetails()
    } catch (err: any) {
      console.error('Error toggling queue pause state:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to toggle queue pause state",
        variant: "destructive"
      })
    }
  }
  
  // Call next customer in queue
  const callNextCustomer = async () => {
    // Only allow calling next customer if queue is active and not paused
    if (queueState !== 'active') {
      toast({
        title: "Cannot call next customer",
        description: queueState === 'paused' 
          ? "The queue is currently paused. Resume it first." 
          : "The queue is not active. Activate it first.",
        variant: "destructive"
      })
      return
    }
    
    // Disable the button immediately
    setIsCallNextDisabled(true)
    
    try {
      const response = await queueService.callNextCustomer(id)
      
      if (response.data?.status === 'success') {
        const { user, ticket_number } = response.data.data
        
        toast({
          title: "Next customer called",
          description: `Now serving ${user?.name || 'Customer'} with ticket #${ticket_number}`,
        })
        
        // Update queue state to ready_to_call
        setQueueState('ready_to_call')
        
        // Refresh queue data
        fetchQueueDetails()
      } else {
        // API returned success: false
        toast({
          title: "No customers in queue",
          description: "There are no more customers waiting in the queue",
          variant: "default"
        })
        
        // Re-enable the button if no customers in queue
        setIsCallNextDisabled(false)
      }
    } catch (err: any) {
      console.error('Error calling next customer:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to call next customer",
        variant: "destructive"
      })
      
      // Re-enable the button on error
      setIsCallNextDisabled(false)
    }
  }
  
  // Handle customer actions (complete, late, remove, etc.)
  const handleCustomerAction = async (action: string, customerId: string) => {
    // For most actions, the queue must be active
    const requiresActiveQueue = ['complete', 'late', 'remove']
    if (requiresActiveQueue.includes(action) && !isQueueActive) {
      toast({
        title: "Queue inactive",
        description: "Cannot perform this action while the queue is inactive",
        variant: "destructive"
      })
      return
    }
    
    // For some actions, the queue must not be paused
    const requiresUnpausedQueue = ['complete']
    if (requiresUnpausedQueue.includes(action) && isQueuePaused) {
      toast({
        title: "Queue paused",
        description: "Cannot perform this action while the queue is paused",
        variant: "destructive"
      })
      return
    }
    
    try {
      // Handle different customer actions
      switch (action) {
        case 'complete':
          await queueService.completeServing(id, customerId)
          toast({
            title: "Customer served",
            description: "The customer has been marked as served"
          })
          
          // Re-enable the Call Next button after completing service
          setIsCallNextDisabled(false)
          
          // Update queue state back to active
          if (queueState === 'ready_to_call') {
            setQueueState('active')
          }
          break
          
        case 'late':
          await queueService.markCustomerAsLate(id, customerId)
          toast({
            title: "Customer marked as late",
            description: "The customer has been moved to the late list"
          })
          break
          
        case 'remove':
          await queueService.removeCustomerFromQueue(id, customerId)
          toast({
            title: "Customer removed",
            description: "The customer has been removed from the queue"
          })
          break
          
        case 'reinsert':
          // Reinsert at end of queue (position = 999 as a placeholder for "end")
          await queueService.reinsertLateCustomer(id, customerId, 999)
          toast({
            title: "Customer reinserted",
            description: "The customer has been added back to the queue"
          })
          break
          
        default:
          console.error(`Unknown action: ${action}`)
          return
      }
      
      // Refresh all data after any action
      fetchAllData()
    } catch (err: any) {
      console.error(`Error performing action ${action}:`, err)
      toast({
        title: "Error",
        description: err.message || `Failed to perform action: ${action}`,
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-2xl font-bold">Loading queue data...</h2>
          <p className="text-muted-foreground mt-2">Please wait while we retrieve the queue information.</p>
        </div>
      </DashboardLayout>
    )
  }
  
  if (error || !queue) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-2xl font-bold">{error || "Queue not found"}</h2>
          <p className="text-muted-foreground mt-2">The queue you're looking for doesn't exist or has been deleted.</p>
          <Link href="/queue" className="mt-4">
            <Button variant="outline">Back to Queues</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title={queue.name}
            description={`${queue.branch?.name || 'All Branches'} • ${formatDate(queue.scheduled_date)} at ${queue.start_time ? new Date(0, 0, 0, ...queue.start_time.split(':').map(Number)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A'}`}
            backLink={{
              href: "/queue",
              label: "Back to Queues",
            }}
            actions={
              <>
                {/* Activate Queue Button - Only show when queue is inactive */}
                {queueState === 'inactive' && (
                  <Button
                    variant="default"
                    className="bg-primary-teal hover:bg-primary-teal/90"
                    onClick={toggleQueueStatus}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Activate Queue
                  </Button>
                )}
                
                {/* Add Customer Button */}
                <Link href={`/queue/${id}/add-customer`}>
                  <Button 
                    className="bg-primary-teal hover:bg-primary-teal/90"
                    disabled={!isQueueActive || isQueuePaused}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </Link>
                
              </>
            }
          />

          <QueueDashboard queue={{
            ...queue,
            currentNumber: servingCustomers.length > 0 ? servingCustomers[0].pivot.position : 0,
            totalInQueue: waitingCustomers.length + servingCustomers.length,
            estimatedWaitTime: waitingCustomers.length > 0 ? `~${waitingCustomers.length * 5} min` : 'No wait',
            averageServiceTime: servedStats?.average_waiting_time 
              ? `${Math.round(servedStats.average_waiting_time / 60)} min` 
              : 'N/A'
          }} />

          <Tabs defaultValue="customer-waiting" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <TabsList>
                <TabsTrigger value="customer-waiting">
                  Customer waiting ({waitingCustomers.length + servingCustomers.length})
                </TabsTrigger>
                <TabsTrigger value="served">
                  Served Today ({servedCustomers.length})
                </TabsTrigger>
                <TabsTrigger value="latecomers">
                  Latecomers ({lateCustomers.length})
                </TabsTrigger>
              </TabsList>
              
              {/* Call Next Customer Button - Positioned near the tabs */}
              <Button 
                className="bg-primary-teal hover:bg-primary-teal/90 ml-4"
                onClick={callNextCustomer}
                disabled={queueState !== 'active' || isCallNextDisabled || waitingCustomers.length === 0}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Call Next Customer
              </Button>
            </div>

            <TabsContent value="customer-waiting">
              <div className="space-y-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    placeholder="Search by name, phone, or service"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Status message for inactive/paused queue */}
                {(!isQueueActive || isQueuePaused) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                    <p className="text-amber-800">
                      {!isQueueActive 
                        ? "This queue is currently inactive. Activate the queue to begin serving customers." 
                        : "This queue is currently paused. Resume the queue to continue serving customers."}
                    </p>
                  </div>
                )}
                
                {allCustomersInQueue.length === 0 && (
                  <div className="bg-muted rounded-md p-8 text-center">
                    <p className="text-muted-foreground">No customers currently waiting in the queue.</p>
                    <Link href={`/queue/${id}/add-customer`} className="mt-4 inline-block">
                      <Button variant="outline" disabled={!isQueueActive || isQueuePaused}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Customer
                      </Button>
                    </Link>
                  </div>
                )}
                
                {allCustomersInQueue.length > 0 && (
                  <QueueCustomersTable 
                    customers={allCustomersInQueue}
                    onAction={handleCustomerAction} 
                    queueActive={isQueueActive && !isQueuePaused}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="served">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="h-12 px-4 text-left font-medium">Customer</th>
                        <th className="h-12 px-4 text-left font-medium">Joined At</th>
                        <th className="h-12 px-4 text-left font-medium">Served At</th>
                        <th className="h-12 px-4 text-left font-medium">Wait Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servedCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center p-4 text-muted-foreground">
                            No customers have been served today yet.
                          </td>
                        </tr>
                      ) : (
                        servedCustomers.map((customer) => (
                          <tr key={customer.uniqueKey || `served-${customer.id}-${Math.random().toString(36).substr(2, 9)}`} className="border-b">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" alt={customer.user.name} />
                                  <AvatarFallback className="bg-primary-teal/10 text-primary-teal">
                                    {customer.user.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{customer.user.name}</div>
                                  <div className="text-sm text-muted-foreground">{customer.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">{formatDate(customer.created_at, { hour: 'numeric', minute: '2-digit' })}</td>
                            <td className="p-4">{formatDate(customer.updated_at, { hour: 'numeric', minute: '2-digit' })}</td>
                            <td className="p-4">{Math.round(customer.waiting_time / 60)} min</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Statistics summary */}
                {servedStats && (
                  <div className="p-4 bg-muted/20 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Total served today: <strong>{servedStats.total_served}</strong></span>
                      <span>Average wait time: <strong>{Math.round(servedStats.average_waiting_time / 60)} minutes</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="latecomers">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="h-12 px-4 text-left font-medium">Customer</th>
                        <th className="h-12 px-4 text-left font-medium">Ticket #</th>
                        <th className="h-12 px-4 text-left font-medium">Joined At</th>
                        <th className="h-12 px-4 text-left font-medium">Marked Late At</th>
                        <th className="h-12 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lateCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center p-4 text-muted-foreground">
                            No late customers at this time.
                          </td>
                        </tr>
                      ) : (
                        lateCustomers.map((customer) => (
                          <tr key={customer.uniqueKey || `${customer.id}-${customer.pivot?.status}-${Math.random().toString(36).substr(2, 9)}`} className="border-b">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" alt={customer.name} />
                                  <AvatarFallback className="bg-primary-teal/10 text-primary-teal">
                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{customer.name}</div>
                                  <div className="text-sm text-muted-foreground">{customer.email || customer.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">{customer.pivot?.ticket_number || '-'}</td>
                            <td className="p-4">{formatDate(customer.pivot?.created_at, { hour: 'numeric', minute: '2-digit' })}</td>
                            <td className="p-4">{formatDate(customer.pivot?.late_at, { hour: 'numeric', minute: '2-digit' })}</td>
                            <td className="p-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCustomerAction('reinsert', customer.id.toString())}
                                disabled={!isQueueActive || isQueuePaused}
                              >
                                Add Back to Queue
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
