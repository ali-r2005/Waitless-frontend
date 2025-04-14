import { Clock, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Queue } from "@/types/queue"

interface QueueDashboardProps {
  queue: Queue
}

export function QueueDashboard({ queue }: QueueDashboardProps) {
  // Calculate progress percentage
  const progressPercentage = (queue.currentNumber / queue.totalInQueue) * 100

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Number</CardTitle>
            <Clock className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue.currentNumber}</div>
            <p className="text-xs text-muted-foreground">Now serving</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
            <Users className="h-4 w-4 text-primary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue.totalInQueue}</div>
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
            <div className="text-2xl font-bold">{queue.averageServiceTime}</div>
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
                <span>Current: #{queue.currentNumber}</span>
                <span>Total: {queue.totalInQueue}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
