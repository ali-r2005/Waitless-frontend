import { useEffect, useState } from "react"
import { Clock, Users, Pause, Play, AlertTriangle, User, Phone, Mail } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Queue, QueueUpdate } from "@/types/queue"
import { formatSecondsFriendly } from "@/lib/utils"
import { getPrivateChannel } from "@/lib/pusher-service"

interface QueueDashboardProps {
  queue: Queue
}

export function QueueDashboard({ queue }: QueueDashboardProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [queueState, setQueueState] = useState<string>(queue.queue_state || 'inactive')
  const [currentServing, setCurrentServing] = useState<any>(queue.currentServing || null)
  const [totalCustomers, setTotalCustomers] = useState(queue.totalInQueue || 0)
  const [averageServiceTime, setAverageServiceTime] = useState(queue.averageServiceTime || 'N/A')
  const [nextCustomer, setNextCustomer] = useState<any>(queue.nextAvailableCustomer || null)

  useEffect(() => {
    try {
      const channel = getPrivateChannel(`staff.queue.${queue.id}`)

      channel.listen('.App\\Events\\StaffQueueUpdate', (data: QueueUpdate) => {
        setIsConnected(true)

        if (data.queue_state) setQueueState(data.queue_state)
        if (data.current_serving) setCurrentServing(data.current_serving)
        if (data.total_customers !== undefined) setTotalCustomers(data.total_customers)
        if (data.average_service_time) setAverageServiceTime(data.average_service_time)
        if (data.next_available_customer) setNextCustomer(data.next_available_customer)
      })

      return () => {
        channel.stopListening('.StaffQueueUpdate')
        if (typeof window !== 'undefined' && window.Echo) {
          window.Echo.leave(`staff.queue.${queue.id}`)
        }
      }
    } catch (error) {
      console.error('Failed to subscribe to queue updates:', error)
      return () => {}
    }
  }, [queue.id])

  const progressPercentage = totalCustomers > 0 ? 100 * (1 / totalCustomers) : 0

  const getStatusBadge = () => {
    switch (queueState) {
      case 'active':
        return <Badge className="bg-waitless-green text-white">Active</Badge>
      case 'paused':
        return <Badge variant="secondary"><Pause className="mr-1 h-3 w-3" />Paused</Badge>
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>
      case 'ready_to_call':
        return <Badge className="bg-waitless-green bg-opacity-80 text-white"><Play className="mr-1 h-3 w-3" />Ready to Call</Badge>
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
              {isConnected ? (
                <Badge variant="outline" className="text-waitless-green border-waitless-green border-opacity-20 bg-waitless-green bg-opacity-5">Live</Badge>
              ) : (
                <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">Connecting...</Badge>
              )}
            </div>
          </div>
          {queueState === 'paused' && (
            <CardDescription>
              <div className="flex items-center text-amber-500 mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" /> Queue is currently paused
              </div>
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Now Serving</CardTitle>
            <User className="h-4 w-4 text-waitless-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentServing?.ticket_number || 'None'}</div>
            <p className="text-xs text-muted-foreground">{currentServing?.name || 'No one'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
            <Users className="h-4 w-4 text-waitless-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Customers waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Service Time</CardTitle>
            <Clock className="h-4 w-4 text-waitless-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSecondsFriendly(averageServiceTime)}</div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Customer</CardTitle>
            <User className="h-4 w-4 text-waitless-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextCustomer?.ticket_number || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{nextCustomer?.name || 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Progress</CardTitle>
          <CardDescription>Progress through the current queue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Current: {currentServing?.ticket_number || 'N/A'}</span>
                <span>Total: {totalCustomers}</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-waitless-green/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {currentServing && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><User className="h-4 w-4" /> {currentServing.name}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {currentServing.phone}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {currentServing.email}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
