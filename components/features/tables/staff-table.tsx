"use client"

import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { StaffMember } from "@/types/staff"

interface StaffTableProps {
  staff: StaffMember[]
  onAction?: (action: string, staffId: number) => void
  isBranchManagersView?: boolean
}

export function StaffTable({ staff, onAction, isBranchManagersView = false }: StaffTableProps) {
  const handleAction = (action: string, staffId: number) => {
    if (onAction) {
      onAction(action, staffId)
    }
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="h-12 px-4 text-left font-medium">Name</th>
              <th className="h-12 px-4 text-left font-medium">Role</th>
              <th className="h-12 px-4 text-left font-medium">Branch</th>
              <th className="h-12 px-4 text-left font-medium">Status</th>
              <th className="h-12 px-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-b">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="bg-waitless-green/10 text-waitless-green">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{member.staff?.role?.name || member.role || "No role assigned"}</td>
                <td className="p-4">{member.branch?.name || "No branch assigned"}</td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  >
                    Active
                  </Badge>
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      
                      {/* Only show promote option for regular staff (not branch managers) */}
                      {!isBranchManagersView && (
                        <DropdownMenuItem onClick={() => handleAction("promote", member.id)}>
                          Promote to Branch Manager
                        </DropdownMenuItem>
                      )}
                      
                      {/* Show remove branch manager role option only for branch managers */}
                      {isBranchManagersView && (
                        <DropdownMenuItem onClick={() => handleAction("removeBranchManagerRole", member.id)}>
                          Remove Branch Manager Role
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleAction("remove", member.id)}
                      >
                        Remove from Staff
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
