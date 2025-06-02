"use client"

import Link from "next/link"
import { MoreHorizontal, Clock, Users, Calendar, Edit, Trash2 } from "lucide-react"

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
import type { Queue } from "@/types/queue"

interface QueueCardProps {
  queue: Queue
  onAction?: (action: string, queueId: number | string) => void
}

export function QueueCard({ queue, onAction }: QueueCardProps) {
  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, queue.id)
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
          {onAction && (
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
                <DropdownMenuItem onClick={() => handleAction("add-customer")}>Add Customer</DropdownMenuItem>
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
          )}
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
        {onAction && (
          <>
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
                onClick={() => handleAction("edit")}
              >
                <Edit className="mr-1 h-4 w-4" />
                Update Queue
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-1/2 text-destructive border-destructive hover:bg-destructive/10"
                onClick={() => handleAction("delete")}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete Queue
              </Button>
            </div>
          </>
        )}
      </CardFooter>

    </Card>
  )
}
