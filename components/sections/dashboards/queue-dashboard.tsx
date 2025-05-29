import { useEffect, useState } from "react"
import { Clock, Users, Pause, Play, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Queue, QueueUpdate } from "@/types/queue"
import { getPrivateChannel } from "@/lib/pusher-service"

interface QueueDashboardProps {
  queue: Queue
}

export function QueueDashboard({ queue }: QueueDashboardProps) {
  // State for real-time updates
  const [isConnected, setIsConnected] = useState(false)
  const [queueState, setQueueState] = useState<'active' | 'paused' | 'inactive' | 'ready_to_call'>(
    queue.is_active ? (queue.is_paused ? 'paused' : 'active') : 'inactive'
  )
  const [currentServing, setCurrentServing] = useState<{ user_id: number | null, ticket_number: string | null }>({
    user_id: null,
    ticket_number: null
  })
  const [totalCustomers, setTotalCustomers] = useState(queue.totalInQueue || 0)
  const [averageServiceTime, setAverageServiceTime] = useState(queue.averageServiceTime || 'N/A')
  
  // Subscribe to real-time updates
  useEffect(() => {
    try {
      // Subscribe to private channel for this queue
      const channel = getPrivateChannel(`staff.queue.${queue.id}`);
      
      // Listen for StaffQueueUpdate events
      channel.listen('.StaffQueueUpdate', (data: QueueUpdate) => {
        setIsConnected(true);
        console.log("dataaaaaaaaaaaaa", data)
        
        // Update state with real-time data
        if (data.queue_state) {
          setQueueState(data.queue_state);
        }
        
        if (data.current_serving) {
          setCurrentServing(data.current_serving);
        }
        
        if (data.total_customers !== undefined) {
          setTotalCustomers(data.total_customers);
        }
        
        if (data.average_service_time) {
          setAverageServiceTime(data.average_service_time);
        }
      });
      
      // Clean up subscription on unmount
      return () => {
        channel.stopListening('.StaffQueueUpdate');
        if (typeof window !== 'undefined' && window.Echo) {
          window.Echo.leave(`staff.queue.${queue.id}`);
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to queue updates:', error);
      return () => {}; // Return empty cleanup function
    }
  }, [queue.id]);
  
  // Calculate progress percentage
  const progressPercentage = totalCustomers > 0 ? 
    (parseInt(currentServing?.ticket_number || '0') / totalCustomers) * 100 :
    0

  // Get status badge based on queue state
  const getStatusBadge = () => {
    switch(queueState) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'paused':
        return <Badge variant="secondary"><Pause className="mr-1 h-3 w-3" />Paused</Badge>
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>
      case 'ready_to_call':
        return <Badge className="bg-blue-500"><Play className="mr-1 h-3 w-3" />Ready to Call</Badge>
      default:
        return null
    }
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>{queue.name}</CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {isConnected ? 
                <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">Live</Badge> : 
                <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">Connecting...</Badge>
              }
            </div>
          </div>
          <CardDescription>
            {queueState === 'paused' && 
              <div className="flex items-center text-amber-500 mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" /> 
                Queue is currently paused
              </div>
            }
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Number</CardTitle>
            <Clock className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentServing?.ticket_number || 'None'}</div>
            <p className="text-xs text-muted-foreground">Now serving</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
            <Users className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Customers waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Wait</CardTitle>
            <Clock className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue.estimatedWaitTime}</div>
            <p className="text-xs text-muted-foreground">For new customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Service Time</CardTitle>
            <Clock className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageServiceTime}</div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Progress</CardTitle>
          <CardDescription>Current progress through the queue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Current: #{currentServing?.ticket_number || '0'}</span>
                <span>Total: {totalCustomers}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
