"use client"

import { useState } from "react"
import Link from "next/link"
import { Pause, Play, Search, UserPlus, MoreHorizontal } from "lucide-react"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/ui/page-header"
import { QueueDashboard } from "@/components/sections/dashboards/queue-dashboard"
import { QueueCustomersTable } from "@/components/features/tables/queue-customers-table"
import { getQueueById, getCustomersInQueue } from "@/lib/data-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ManageQueuePage({ params }: { params: { id: string } }) {
  const [isQueueActive, setIsQueueActive] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Get queue data from the data service
  const queue = getQueueById(params.id)
  const customersInQueue = getCustomersInQueue(params.id)

  // Filter customers based on search query
  const filteredCustomers = customersInQueue.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.service.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleQueueStatus = () => {
    setIsQueueActive(!isQueueActive)
  }

  const handleCustomerAction = (action: string, customerId: string) => {
    console.log(`Action: ${action}, Customer ID: ${customerId}`)
    // In a real app, you would implement the action logic here
  }

  if (!queue) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-2xl font-bold">Queue not found</h2>
          <p className="text-muted-foreground mt-2">The queue you're looking for doesn't exist or has been deleted.</p>
          <Link href="/queue" className="mt-4">
            <Button variant="outline">Back to Queues</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title={queue.name}
            description={`${queue.branch} • Created on ${queue.createdAt}`}
            backLink={{
              href: "/queue",
              label: "Back to Queues",
            }}
            actions={
              <>
                <Button
                  variant={isQueueActive ? "outline" : "default"}
                  className={isQueueActive ? "" : "bg-primary-teal hover:bg-primary-teal/90"}
                  onClick={toggleQueueStatus}
                >
                  {isQueueActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Queue
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Resume Queue
                    </>
                  )}
                </Button>
                <Link href="/queue/add-customer">
                  <Button className="bg-primary-teal hover:bg-primary-teal/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </Link>
              </>
            }
          />

          <QueueDashboard queue={queue} />

          <Tabs defaultValue="current-queue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="current-queue">Current Queue</TabsTrigger>
              <TabsTrigger value="served">Served Today</TabsTrigger>
              <TabsTrigger value="no-shows">No Shows</TabsTrigger>
            </TabsList>

            <TabsContent value="current-queue">
              <div className="flex items-center gap-2 pb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, phone, or service..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <QueueCustomersTable customers={filteredCustomers} onAction={handleCustomerAction} />
            </TabsContent>

            <TabsContent value="served">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="h-12 px-4 text-left font-medium">Customer</th>
                        <th className="h-12 px-4 text-left font-medium">Service</th>
                        <th className="h-12 px-4 text-left font-medium">Joined At</th>
                        <th className="h-12 px-4 text-left font-medium">Served At</th>
                        <th className="h-12 px-4 text-left font-medium">Wait Time</th>
                        <th className="h-12 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" alt="Sarah Taylor" />
                              <AvatarFallback className="bg-primary-teal/10 text-primary-teal">ST</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Sarah Taylor</div>
                              <div className="text-sm text-muted-foreground">+1 (555) 234-5678</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">Haircut</td>
                        <td className="p-4">09:45 AM</td>
                        <td className="p-4">10:15 AM</td>
                        <td className="p-4">30 min</td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" alt="David Wilson" />
                              <AvatarFallback className="bg-primary-teal/10 text-primary-teal">DW</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">David Wilson</div>
                              <div className="text-sm text-muted-foreground">+1 (555) 876-5432</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">Beard Trim</td>
                        <td className="p-4">09:30 AM</td>
                        <td className="p-4">09:50 AM</td>
                        <td className="p-4">20 min</td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="no-shows">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="h-12 px-4 text-left font-medium">Customer</th>
                        <th className="h-12 px-4 text-left font-medium">Service</th>
                        <th className="h-12 px-4 text-left font-medium">Joined At</th>
                        <th className="h-12 px-4 text-left font-medium">Marked Absent At</th>
                        <th className="h-12 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" alt="James Anderson" />
                              <AvatarFallback className="bg-primary-teal/10 text-primary-teal">JA</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">James Anderson</div>
                              <div className="text-sm text-muted-foreground">+1 (555) 987-6543</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">Haircut</td>
                        <td className="p-4">09:15 AM</td>
                        <td className="p-4">10:00 AM</td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            Add Back to Queue
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
