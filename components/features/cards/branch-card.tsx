"use client"
import { Building2, Eye, MapPin, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Branch } from "@/types/branch"

interface BranchCardProps {
  branch: Branch
  onAction?: (action: string, branchId: number) => void
}

export function BranchCard({ branch, onAction }: BranchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className="group overflow-hidden border border-[#10bc69]/30 dark:border-[#10bc69]/20 bg-white dark:bg-gray-800 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#10bc69]/20 dark:hover:shadow-[#10bc69]/15 hover:-translate-y-2 relative h-[280px] flex flex-col transform transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{borderRadius: "12px"}}
    >
      {/* Gradient border effect */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#10bc69]/20 via-[#10bc69]/0 to-[#10bc69]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-2 bg-gradient-to-r from-white to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent group-hover:from-[#10bc69] group-hover:to-[#10bc69] transition-all duration-300">
          {branch.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-5 space-y-4 flex-grow">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            <div className="flex justify-center items-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full mr-3 group-hover:bg-[#10bc69]/10 transition-colors duration-300">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-[#10bc69] transition-colors duration-300" />
            </div>
            <span className="flex-1">{branch.address}</span>
          </div>
          
          {branch.parent_id && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
              <div className="flex justify-center items-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full mr-3 group-hover:bg-[#10bc69]/10 transition-colors duration-300">
                <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-[#10bc69] transition-colors duration-300" />
              </div>
              <span className="flex-1">Parent Branch: {branch.parent?.name || `ID: ${branch.parent_id}`}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col space-y-3 relative overflow-hidden">
        
        {/* Action buttons that appear on hover - now in footer */}
        <div className={`flex justify-center w-full space-x-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onAction?.("view", branch.id)}
                  className="bg-amber-100 text-amber-600 hover:bg-amber-200 hover:text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onAction?.("edit", branch.id)}
                  className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Branch</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onAction?.("delete", branch.id)}
                  className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Branch</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Hover gradient at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10bc69] to-[#10bc69] transform origin-left transition-transform duration-500 ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}></div>
      </CardFooter>
    </Card>
  )
}
