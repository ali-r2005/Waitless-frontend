"use client"

import { Check, MoreHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PriorityBadge } from "@/components/features/badges/priority-badge"
import type { QueueCustomer } from "@/types/queue"

interface QueueCustomersTableProps {
  customers: QueueCustomer[]
  onAction: (action: string, customerId: string) => void
}

export function QueueCustomersTable({ customers, onAction }: QueueCustomersTableProps) {
  const handleAction = (action: string, customerId: string) => {
    onAction(action, customerId)
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-center text-muted-foreground">No customers found in the queue.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {customers.map((customer) => (
        <Card key={customer.id} className={customer.status === "current" ? "border-primary-teal" : ""}>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  {customer.name}
                  {customer.status === "current" && (
                    <span className="rounded-full bg-primary-teal px-2 py-0.5 text-xs text-white">Current</span>
                  )}
                  <PriorityBadge priority={customer.priority} />
                </div>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
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
                  <DropdownMenuItem onClick={() => handleAction("edit", customer.id)}>Edit Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("changeService", customer.id)}>
                    Change Service
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("changePriority", customer.id)}>
                    Change Priority
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => handleAction("remove", customer.id)}>
                    Remove from Queue
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{customer.service}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined At</p>
                <p className="font-medium">{customer.joinedAt}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wait Time</p>
                <p className="font-medium">{customer.estimatedWait}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">
                  {customer.status === "current"
                    ? "Now Serving"
                    : `#${customers.findIndex((c) => c.id === customer.id) + 1}`}
                </p>
              </div>
            </div>

            {customer.status === "current" ? (
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleAction("markAbsent", customer.id)}>
                  <X className="mr-2 h-4 w-4" />
                  Mark as Absent
                </Button>
                <Button
                  className="flex-1 bg-primary-teal hover:bg-primary-teal/90"
                  onClick={() => handleAction("complete", customer.id)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Complete & Next
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleAction("remove", customer.id)}>
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </Button>
                <Button
                  className="flex-1 bg-primary-teal hover:bg-primary-teal/90"
                  onClick={() => handleAction("serveNow", customer.id)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Serve Now
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
