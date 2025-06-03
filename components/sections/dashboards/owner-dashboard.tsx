"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Activity, Users, CalendarDays, Clock, 
  Store, Award, Loader2, TicketIcon 
} from "lucide-react"
import type { Queue as QueueType, ServedCustomer as ServedCustomerType } from "@/types/queue"
import type { StaffMember as StaffMemberType } from "@/types/staff"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { branchService } from "@/lib/branch-service"
import { staffService } from "@/lib/staff-service"
import { queueService } from "@/lib/queue-service"
import { Button } from "@/components/ui/button"
import { formatSecondsFriendly } from "@/lib/utils"

// Define interfaces for data types
interface Branch {
  id: number
  name: string
  address: string
  parent_id?: number | null
  business_id: number
}

// Extend the StaffMember type from staff.ts
interface StaffMember extends StaffMemberType {
  branch_name?: string
}

// Use our custom Queue interface that extends the type from queue.ts
interface Queue extends Omit<QueueType, 'currentNumber'> {
  branch_name: string
  current_number: number
}

// Extend the ServedCustomer type from queue.ts
interface ServedCustomer extends ServedCustomerType {
  uniqueKey?: string
  queue?: {
    id: number
    name: string
  }
}

interface BranchStat {
  branch_id: number
  branch_name: string
  total_served: number
  average_waiting_time: number
  queues?: {
    queue_id: number
    queue_name: string
    total_served: number
    average_waiting_time: number
  }[]
}

interface Statistics {
  total_served: number
  average_waiting_time: number
  date: string
  branches?: BranchStat[]
}

interface ServedCustomerResponse {
  served_customers: ServedCustomer[]
  statistics: Statistics
}

export function OwnerDashboard() {
  // State for all data
  const [branches, setBranches] = useState<Branch[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [queues, setQueues] = useState<Queue[]>([])
  const [activeQueues, setActiveQueues] = useState<Queue[]>([])
  const [servedCustomers, setServedCustomers] = useState<ServedCustomer[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch all data concurrently
        const [branchesResponse, staffResponse, queuesResponse, activeQueuesResponse, servedResponse] = 
          await Promise.all([
            branchService.getBranches().catch(() => ({ data: [] })),
            staffService.getStaffMembers().catch(() => ({ data: [] })),
            queueService.getQueues().catch(() => ({ data: { data: [] } })),
            queueService.getQueues({ is_active: true }).catch(() => ({ data: { data: [] } })),
            queueService.getCustomersServedToday().catch(() => ({ data: { data: { served_customers: [], statistics: null } } }))
          ])
        
        // Process branches
        const branchesData = Array.isArray(branchesResponse) ? 
          branchesResponse : 
          (branchesResponse.data || [])
        setBranches(branchesData)
        
        // Process staff
        const staffData = Array.isArray(staffResponse) ? 
          staffResponse : 
          (staffResponse.data || [])
        setStaffMembers(staffData as StaffMember[])
        
        // Process queues
        const queuesData = queuesResponse.data?.data || []
        setQueues(queuesData as Queue[])
        
        // Process active queues
        const activeQueuesData = activeQueuesResponse.data?.data || []
        setActiveQueues(activeQueuesData as Queue[])
        
        // Process served customers and statistics
        const servedData = servedResponse.data?.data as ServedCustomerResponse
        if (servedData) {
          const servedWithKeys = servedData.served_customers.map((customer, index) => ({
            ...customer,
            uniqueKey: `served-${customer.id}-${index}`
          }))
          
          setServedCustomers(servedWithKeys)
          setStatistics(servedData.statistics)
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [retryCount])
  
  // Calculate the top performing branch based on lowest average wait time
  const topPerformingBranch = useMemo(() => {
    if (!statistics?.branches?.length) return null
    
    return [...statistics.branches].sort((a, b) => 
      a.average_waiting_time - b.average_waiting_time
    )[0]
  }, [statistics])
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Business Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="h-[120px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[140px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-[100px]" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="h-[300px]">
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent className="h-[220px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </CardContent>
          </Card>
          
          <Card className="h-[300px]">
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent className="h-[220px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Business Overview</h2>
        <Alert variant="destructive" className="mb-6">
          <Activity className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
              <Button onClick={() => setRetryCount(prev => prev + 1)} className="mt-2 bg-waitless-green hover:bg-waitless-green/90 text-white">
                Retry
              </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Business Overview</h2>
      <p className="text-muted-foreground mb-4">
        Welcome to your business dashboard. Here's a summary of your current operations.
      </p>
      
      {/* KPI Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Branches Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Locations across your business
            </p>
          </CardContent>
        </Card>
        
        {/* Total Staff Members Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffMembers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active employees across all branches
            </p>
          </CardContent>
        </Card>
        
        {/* Total Queues Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queues</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queues.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Service queues across all branches
            </p>
          </CardContent>
        </Card>
        
        {/* Active Queues Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeQueues.length}</div>
            <div className="flex items-center pt-1">
              <Badge variant={activeQueues.length > 0 ? "default" : "secondary"}>
                {activeQueues.length > 0 ? "Live" : "None Active"}
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                {Math.round((activeQueues.length / Math.max(queues.length, 1)) * 100)}% active
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Customers Served Today Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Served Today</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total_served || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics?.date ? `For ${new Date(statistics.date).toLocaleDateString()}` : 'Today'}
            </p>
          </CardContent>
        </Card>
        
        {/* Average Wait Time Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.average_waiting_time ? 
                formatSecondsFriendly(statistics.average_waiting_time) : 
                'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average across all branches
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        {/* Bar Chart: Served Customers by Branch */}
        <Card>
          <CardHeader>
            <CardTitle>Served Customers by Branch</CardTitle>
            <CardDescription>Distribution of customers served today</CardDescription>
          </CardHeader>
          <CardContent>
            {statistics?.branches && statistics.branches.length > 0 ? (
              <div className="space-y-4">
                {statistics.branches.map((branch) => (
                  <div key={branch.branch_id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{branch.branch_name}</span>
                      <span>{branch.total_served} customers</span>
                    </div>
                    <Progress 
                      value={(branch.total_served / statistics.total_served) * 100} 
                      className="h-2 bg-waitless-green/20"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <p>No data available for today</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Bar Chart: Average Wait Time by Branch */}
        <Card>
          <CardHeader>
            <CardTitle>Average Wait Time by Branch</CardTitle>
            <CardDescription>Average waiting times across branches</CardDescription>
          </CardHeader>
          <CardContent>
            {statistics?.branches && statistics.branches.length > 0 ? (
              <div className="space-y-4">
                {statistics.branches.map((branch) => (
                  <div key={branch.branch_id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{branch.branch_name}</span>
                      <span>{formatSecondsFriendly(branch.average_waiting_time)}</span>
                    </div>
                    <Progress 
                      value={(branch.average_waiting_time / (statistics.branches?.reduce(
                        (max, b) => Math.max(max, b.average_waiting_time), 1
                      ) || 1)) * 100} 
                      className="h-2 bg-waitless-green/20"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <p>No data available for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Top Performing Branch */}
      {topPerformingBranch && (
        <Card className="mt-6 border-2 border-waitless-green/20">
          <CardHeader>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-waitless-green" />
              <CardTitle>Top Performing Branch</CardTitle>
            </div>
            <CardDescription>Branch with the shortest average wait time today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-waitless-green">{topPerformingBranch.branch_name}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{topPerformingBranch.total_served}</span> customers served today
                </div>
              </div>
              <div className="text-right">
                <h4 className="scroll-m-20 text-base font-semibold tracking-tight">
                  {formatSecondsFriendly(topPerformingBranch.average_waiting_time)} avg. wait
                </h4>
                <div className="text-sm text-muted-foreground">
                  Average wait time
                </div>
              </div>
            </div>
            
            {/* Show queues within this branch if available */}
            {topPerformingBranch.queues && topPerformingBranch.queues.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Queues performance:</h4>
                <div className="space-y-3">
                  {topPerformingBranch.queues.map(queue => (
                    <div key={queue.queue_id} className="bg-muted/50 p-2 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span>{queue.queue_name}</span>
                        <Badge variant="outline" className="border-waitless-green bg-white text-waitless-green hover:bg-waitless-green/10 dark:bg-dark-500">
                          {queue.total_served} served
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Avg wait: {formatSecondsFriendly(queue.average_waiting_time)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
