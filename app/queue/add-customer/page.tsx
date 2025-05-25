"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Users, Plus, ArrowLeft, Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/ui/page-header"
import { staffService } from "@/lib/staff-service"
import { queueService } from "@/lib/queue-service"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StaffUser } from "@/types/staff"
import type { Queue } from "@/types/queue"

export default function AddCustomerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queueId = searchParams.get("queueId")
  
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userSearchResults, setUserSearchResults] = useState<StaffUser[]>([])
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [queues, setQueues] = useState<Queue[]>([])
  const [selectedQueueId, setSelectedQueueId] = useState<string>(queueId || "")

  // Fetch available queues on component mount
  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await queueService.getQueues({ is_active: true })
        if (response.data?.data) {
          setQueues(response.data.data)
          
          // If no queue ID was provided in URL and we have queues, select the first one
          if (!queueId && response.data.data.length > 0) {
            setSelectedQueueId(response.data.data[0].id.toString())
          }
        }
      } catch (error) {
        console.error("Error fetching queues:", error)
        toast({
          title: "Error",
          description: "Failed to fetch available queues",
          variant: "destructive",
        })
      }
    }

    fetchQueues()
  }, [queueId])

  // Handle user search input change
  const handleUserSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchQuery(e.target.value)
  }

  // Search for users
  const handleSearchUsers = async () => {
    if (!userSearchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const users = await staffService.searchUsersToAddAsStaff(userSearchQuery)
      setUserSearchResults(users)
    } catch (error) {
      console.error("Error searching for users:", error)
      toast({
        title: "Error",
        description: "Failed to search for users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle selecting a user
  const handleSelectUser = (user: StaffUser) => {
    setSelectedUser(user)
  }

  // Handle adding a customer to the queue
  const handleAddCustomerToQueue = async () => {
    if (!selectedUser || !selectedQueueId) {
      toast({
        title: "Error",
        description: "Please select both a customer and a queue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await queueService.addCustomerToQueue(selectedQueueId, selectedUser.id.toString())
      
      toast({
        title: "Success",
        description: `${selectedUser.name} has been added to the queue`,
        className: "bg-waitless-green text-white",
      })
      
      // Reset selection and search results
      setSelectedUser(null)
      setUserSearchResults([])
      setUserSearchQuery("")
      
      // Navigate back to queue page
      router.push("/queue")
    } catch (error) {
      console.error("Error adding customer to queue:", error)
      toast({
        title: "Error",
        description: "Failed to add customer to queue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <PageHeader 
            title="Add Customer to Queue" 
          />
          <Button 
                variant="outline" 
                onClick={() => router.push("/queue")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Queues
          </Button>
        </div>

        <div className="space-y-4">
          {/* Selected Customer */}
          {selectedUser && (
            <div className="rounded-md border p-4">
              <h3 className="mb-4 text-lg font-medium">Selected Customer</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-waitless-green/10 flex items-center justify-center text-waitless-green">
                    {selectedUser.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                >
                  Change
                </Button>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleAddCustomerToQueue}
                  disabled={isSubmitting || !selectedQueueId}
                  className="bg-waitless-green hover:bg-waitless-green/90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Queue
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Search results for adding new customer */}
          {userSearchResults.length > 0 && !selectedUser && (
            <div className="rounded-md border p-4">
              <h3 className="mb-4 text-lg font-medium">Search Results</h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {userSearchResults.map((user) => (
                  <div key={user.id} className="flex flex-col rounded-md border p-4 transition-all hover:border-waitless-green/50 hover:shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-waitless-green/10 flex items-center justify-center text-waitless-green">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleSelectUser(user)} 
                      disabled={isLoading}
                      className="mt-auto bg-waitless-green hover:bg-waitless-green/90 text-white"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Select Customer
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search form for adding new customer */}
          {userSearchResults.length === 0 && !selectedUser && (
            <div className="rounded-md bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-waitless-green opacity-80 mb-4" />
              <h3 className="mb-2 text-lg font-medium">Find Customer to Add to Queue</h3>
              <p className="mb-4 text-sm text-muted-foreground max-w-md mx-auto">
                Search for customers by name or email to add them to your selected queue
              </p>
              
              <div className="flex max-w-md mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search customers by name or email"
                    value={userSearchQuery}
                    onChange={handleUserSearchInputChange}
                    className="pl-10 border-r-0 rounded-r-none focus-visible:ring-waitless-green/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchUsers();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleSearchUsers} 
                  disabled={isLoading || !userSearchQuery.trim()}
                  className="rounded-l-none bg-waitless-green hover:bg-waitless-green/90 text-white"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
