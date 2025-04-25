"use client"
import { Building2, Eye, MapPin, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  onAction?: (action: string, branchId: number) => void
}

export function BranchCard({ branch, onAction }: BranchCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{branch.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onAction?.("view", branch.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction?.("edit", branch.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Branch
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onAction?.("delete", branch.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Branch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-2 h-4 w-4" />
            {branch.address}
          </div>
          {branch.parent_id && (
            <div className="flex items-center text-sm text-gray-500">
              <Building2 className="mr-2 h-4 w-4" />
              Parent Branch ID: {branch.parent_id}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
