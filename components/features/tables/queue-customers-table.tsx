"use client"

import { User, CheckCircle2, Clock, XCircle, AlertTriangle, MoreHorizontal, Check, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate, formatSecondsFriendly } from "@/lib/utils"
import type { QueueCustomer } from "@/types/queue"

interface QueueCustomersTableProps {
  customers: QueueCustomer[]
  onAction: (action: string, customerId: string) => void
  queueActive?: boolean // Whether the queue is active and not paused
}

export function QueueCustomersTable({ customers, onAction, queueActive = true }: QueueCustomersTableProps) {
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
  
  // Group customers by status
  const servingCustomers = customers.filter(c => c.pivot?.status === 'serving')
  const waitingCustomers = customers.filter(c => c.pivot?.status === 'waiting')

  return (
    <div className="space-y-8">
      {/* Serving Section */}
      {servingCustomers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <Clock className="h-5 w-5 text-waitless-green" />
            <h3>Now Serving</h3>
          </div>
          <div className="grid gap-4">
            {servingCustomers.map((customer) => (
              <Card key={customer.uniqueKey || `${customer.id}-${customer.pivot?.status}`} className="border-waitless-green">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 font-medium">
                            {customer.name}
                            <Badge className="bg-waitless-green">Current</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{customer.email || customer.phone}</p>
                        </div>
                      </div>
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
                        <DropdownMenuItem onClick={() => handleAction("edit", customer.id.toString())}>Edit Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleAction("remove", customer.id.toString())}>
                          Remove from Queue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Ticket #</p>
                      <p className="font-medium">{customer.pivot?.ticket_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Joined At</p>
                      <p>{customer.pivot?.created_at ? formatDate(customer.pivot.created_at, { hour: 'numeric', minute: '2-digit' }) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Position</p>
                      <p className="font-medium">#{customer.pivot?.position || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Wait Time</p>
                      <p className="font-medium">{formatSecondsFriendly(customer.pivot?.waiting_time)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => handleAction("late", customer.id.toString())}
                      disabled={!queueActive}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Mark as Late
                    </Button>
                    <Button
                      className="flex-1 bg-waitless-green hover:bg-waitless-green/90"
                      onClick={() => handleAction("complete", customer.id.toString())}
                      disabled={!queueActive}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Waiting Section */}
      {waitingCustomers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <User className="h-5 w-5 text-waitless-green" />
            <h3>Waiting ({waitingCustomers.length})</h3>
          </div>
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Customer</th>
                  <th className="p-3 text-left font-medium">Ticket #</th>
                  <th className="p-3 text-left font-medium">Position</th>
                  <th className="p-3 text-left font-medium">Joined At</th>
                  <th className="p-3 text-left font-medium">Wait Time</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitingCustomers.map((customer) => (
                  <tr key={customer.uniqueKey || `${customer.id}-${customer.pivot?.status}`} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email || customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{customer.pivot?.ticket_number || 'N/A'}</td>
                    <td className="p-3">#{customer.pivot?.position || 0}</td>
                    <td className="p-3">{customer.pivot?.created_at ? formatDate(customer.pivot.created_at, { hour: 'numeric', minute: '2-digit' }) : 'N/A'}</td>
                    <td className="p-3 text-waitless-green font-medium">{formatSecondsFriendly(customer.pivot?.waiting_time)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction("remove", customer.id.toString())}
                          disabled={!queueActive}
                        >
                          <X className="mr-1 h-3 w-3" />
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
