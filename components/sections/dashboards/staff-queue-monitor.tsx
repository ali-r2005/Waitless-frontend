"use client"

import { useState, useEffect } from "react"
import { Clock, Users, BarChart4, Activity, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QueueDashboard } from "@/components/sections/dashboards/queue-dashboard"
import { queueService } from "@/lib/queue-service"
import { formatDate } from "@/lib/utils"
// useAuth removed as we're now receiving user as a prop

// Define the new statistics interface based on the updated API response
interface QueueStatistics {
  total_served: number
  average_waiting_time: number // in seconds
  date: string
  queues?: {
    queue_id: number
    queue_name: string
    total_served: number
    average_waiting_time: number
  }[]
}

// Extended QueueCustomer interface for the staff dashboard
interface QueueCustomerExtended {
  id: number
  name: string
  email?: string
  pivot?: {
    queue_id: number
    user_id: number
    status: 'waiting' | 'serving' | 'served' | 'late' | 'being_served'
    ticket_number: string
    position: number
    waiting_time: number
    created_at: string
    updated_at: string
    served_at: string | null
    late_at: string | null
  }
}

interface ServedCustomer {
  id: number
  queue_id: number
  user_id: number
  waiting_time: number // in seconds
  created_at: string
  updated_at: string
  uniqueKey?: string
  user: {
    id: number
    name: string
    email: string
  }
  queue?: {
    id: number
    name: string
  }
}

interface ServedCustomerResponse {
  served_customers: ServedCustomer[]
  statistics: QueueStatistics
}

export function StaffQueueMonitor({ user: userProp }: { user: any }) {
  // We can use the user prop directly instead of useAuth() since it's passed from the parent
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [servedCustomers, setServedCustomers] = useState<ServedCustomer[]>([])
  const [statistics, setStatistics] = useState<QueueStatistics | null>(null)
  const [activeQueue, setActiveQueue] = useState<any>(null)

  // Fetch served customers and active queue data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch served customers - no ID needed as backend filters by authenticated staff
        const servedResponse = await queueService.getCustomersServedToday()
        
        if (servedResponse.data?.data) {
          const data = servedResponse.data.data as ServedCustomerResponse
          
          // Add unique keys to served customers
          const servedWithKeys = data.served_customers.map((customer, index) => ({
            ...customer,
            uniqueKey: `served-${customer.id}-${index}`
          }))
          
          setServedCustomers(servedWithKeys)
          setStatistics(data.statistics)
          
          // If there's an active queue in the response, set it
          if (data.statistics.queues && data.statistics.queues.length > 0) {
            const activeQueueId = data.statistics.queues[0].queue_id
            try {
              const queueResponse = await queueService.getQueueDetails(activeQueueId.toString())
              if (queueResponse.data?.data) {
                const queueData = queueResponse.data.data
                setActiveQueue({
                  ...queueData,
                  currentNumber: 0, // Will be updated if there are serving customers
                  totalInQueue: 0,  // Will be updated from API
                  estimatedWaitTime: 'N/A',
                  averageServiceTime: statistics ? 
                    `${Math.round(statistics.average_waiting_time / 60)} min` : 
                    'N/A'
                })
                
                // Fetch queue customers to get current number and total in queue
                const customersResponse = await queueService.getQueueCustomers(activeQueueId.toString())
                if (customersResponse.data?.data) {
                  // Cast to extended interface that includes 'being_served' status
                  const customers = customersResponse.data.data as QueueCustomerExtended[]
                  const waiting = customers.filter(c => c.pivot?.status === 'waiting')
                  // Handle different status values that might come from the API
                  const serving = customers.filter(c => {
                    const status = c.pivot?.status
                    return status === 'serving' || status === 'being_served'
                  })
                  
                  setActiveQueue((prev: any) => ({
                    ...prev,
                    currentNumber: serving.length > 0 && serving[0].pivot ? serving[0].pivot.position : 0,
                    totalInQueue: waiting.length + serving.length,
                    estimatedWaitTime: waiting.length > 0 ? `~${waiting.length * 5} min` : 'No wait'
                  }))
                }
              }
            } catch (err) {
              console.error('Error fetching active queue details:', err)
            }
          }
        }
        
        setIsLoading(false)
      } catch (err: any) {
        console.error('Error fetching staff dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
        setIsLoading(false)
      }
    }
    
    fetchData()
    
    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(() => {
      fetchData()
    }, 5 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [])
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-[#10bc69] animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-8 text-center">
        <div className="inline-block p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">{error}</h3>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Staff Dashboard</h2>
      <p className="text-muted-foreground">
        Welcome back, {userProp?.name}. Here's an overview of your queue activity today.
      </p>
      
      {/* Active Queue Dashboard */}
      {activeQueue ? (
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-2">
            Welcome, {userProp?.name || 'Staff Member'}
          </h3>
          <QueueDashboard queue={activeQueue} />
        </div>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>No Active Queue</CardTitle>
            <CardDescription>You don't have any active queues at the moment</CardDescription>
          </CardHeader>
        </Card>
      )}
      
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Served Today</CardTitle>
            <Users className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_served || 0}</div>
            <p className="text-xs text-muted-foreground">Customers completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics ? `${Math.round(statistics.average_waiting_time / 60)} min` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics && statistics.total_served > 0 ? 
                `${Math.round(statistics.total_served / (new Date().getHours() - 9))} / hr` : 
                'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Customers per hour</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Served Customers Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Customers Served Today</h3>
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-12 px-4 text-left font-medium">Customer</th>
                    <th className="h-12 px-4 text-left font-medium">Queue</th>
                    <th className="h-12 px-4 text-left font-medium">Joined At</th>
                    <th className="h-12 px-4 text-left font-medium">Served At</th>
                    <th className="h-12 px-4 text-left font-medium">Wait Time</th>
                  </tr>
                </thead>
                <tbody>
                  {servedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-muted-foreground">
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
                              <AvatarFallback className="bg-waitless-green bg-opacity-10 text-waitless-green">
                                {customer.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.user.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{customer.queue?.name || 'Unknown Queue'}</td>
                        <td className="p-4">{formatDate(customer.created_at, { hour: 'numeric', minute: '2-digit' })}</td>
                        <td className="p-4">{formatDate(customer.updated_at, { hour: 'numeric', minute: '2-digit' })}</td>
                        <td className="p-4 text-waitless-green font-medium">{Math.round(customer.waiting_time / 60)} min</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Queue Performance Chart - Only show if there are multiple queues */}
      {statistics?.queues && statistics.queues.length > 1 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Queue Performance</h3>
          <Card>
            <CardHeader>
              <CardTitle>Served Customers by Queue</CardTitle>
              <CardDescription>Distribution of customers served across different queues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statistics.queues.map((queue) => (
                  <div key={queue.queue_id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{queue.queue_name}</span>
                      <span>{queue.total_served} customers</span>
                    </div>
                    <Progress 
                      value={(queue.total_served / statistics.total_served) * 100} 
                      className="h-2 bg-waitless-green/20" 
                    />
                    <div className="text-xs text-muted-foreground">
                      Avg. wait time: <span className="text-waitless-green font-medium">{Math.round(queue.average_waiting_time / 60)} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
