"use client"

import Link from "next/link"
import { MoreHorizontal } from "lucide-react"

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
import { QueueStatusBadge } from "@/components/features/badges/queue-status-badge"
import type { Queue } from "@/types/queue"

interface QueueCardProps {
  queue: Queue
  onAction?: (action: string, queueId: string) => void
}

export function QueueCard({ queue, onAction }: QueueCardProps) {
  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, queue.id)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {queue.name}
              <QueueStatusBadge status={queue.status} />
            </CardTitle>
            <CardDescription>{queue.branch}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleAction("manage")}>Manage Queue</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("edit")}>Edit Queue</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("toggle")}>
                {queue.status === "active" ? "Pause Queue" : "Resume Queue"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => handleAction("close")}>
                Close Queue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Current Number</p>
            <p className="font-medium">#{queue.currentNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total in Queue</p>
            <p className="font-medium">{queue.totalInQueue}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Estimated Wait Time</p>
            <p className="font-medium">{queue.estimatedWaitTime}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
        <Link href={`/queue/add-customer?queueId=${queue.id}`}>
          <Button variant="outline" size="sm">
            Add Customer
          </Button>
        </Link>
        <Link href={`/queue/manage/${queue.id}`}>
          <Button size="sm" className="bg-primary-teal hover:bg-primary-teal/90">
            Manage Queue
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
