"use client"
import { Building2, MapPin, MoreHorizontal, Users } from "lucide-react"

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
import type { Branch } from "@/types/branch"

interface BranchCardProps {
  branch: Branch
  onAction?: (action: string, branchId: string) => void
}

export function BranchCard({ branch, onAction }: BranchCardProps) {
  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, branch.id)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-teal" />
              {branch.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {branch.location}
            </CardDescription>
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
              <DropdownMenuItem onClick={() => handleAction("edit")}>Edit Branch</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("viewQueue")}>View Queue</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("manageStaff")}>Manage Staff</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => handleAction("delete")}>
                Delete Branch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 py-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Manager:</span>
            <span className="text-sm font-medium">{branch.manager}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 py-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Staff:</span>
            <span className="text-sm font-medium">{branch.staffCount} members</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
        <Button variant="outline" size="sm" onClick={() => handleAction("viewDetails")}>
          View Details
        </Button>
        <Button
          size="sm"
          className="bg-primary-teal hover:bg-primary-teal/90"
          onClick={() => handleAction("manageQueue")}
        >
          Manage Queue
        </Button>
      </CardFooter>
    </Card>
  )
}
