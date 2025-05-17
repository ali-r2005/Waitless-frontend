"use client"

import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { StaffRequest } from "@/types/staff"

interface StaffRequestsTableProps {
  requests: StaffRequest[]
  onApprove: (requestId: number) => void
  onReject: (requestId: number) => void
}

export function StaffRequestsTable({ requests, onApprove, onReject }: StaffRequestsTableProps) {
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="h-12 px-4 text-left font-medium">Name</th>
              <th className="h-12 px-4 text-left font-medium">Requested Role</th>
              <th className="h-12 px-4 text-left font-medium">Requested Branch</th>
              <th className="h-12 px-4 text-left font-medium">Request Date</th>
              <th className="h-12 px-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                      <AvatarFallback className="bg-primary-teal/10 text-primary-teal">
                        {request.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{request.name}</div>
                      <div className="text-sm text-muted-foreground">{request.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{request.requestedRole}</td>
                <td className="p-4">{request.requestedBranch}</td>
                <td className="p-4">{request.requestDate}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 border-red-200 bg-red-100/50 text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-500"
                      onClick={() => onReject(request.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 gap-1 bg-primary-teal hover:bg-primary-teal/90"
                      onClick={() => onApprove(request.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
