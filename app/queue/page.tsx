"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, Plus, Search, Users } from "lucide-react"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/ui/page-header"
import { QueueCard } from "@/components/features/cards/queue-card"
import { getActiveQueues } from "@/lib/data-service"

export default function QueuePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Get queue data from the data service
  const queues = getActiveQueues()

  // Filter queues based on search query
  const filteredQueues = queues.filter(
    (queue) =>
      queue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      queue.branch.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleQueueAction = (action: string, queueId: string) => {
    console.log(`Action: ${action}, Queue ID: ${queueId}`)
    // In a real app, you would implement the action logic here
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="Queue Management"
            actions={
              <>
                <Link href="/queue/add-customer">
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </Link>
                <Link href="/queue/create">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Queue
                  </Button>
                </Link>
                <Link href="/queue/start">
                  <Button className="bg-primary-teal hover:bg-primary-teal/90">
                    <Play className="mr-2 h-4 w-4" />
                    Start Queue
                  </Button>
                </Link>
              </>
            }
          />

          <Tabs defaultValue="active-queues" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active-queues">Active Queues</TabsTrigger>
              <TabsTrigger value="closed-queues">Closed Queues</TabsTrigger>
              <TabsTrigger value="queue-history">Queue History</TabsTrigger>
            </TabsList>

            <TabsContent value="active-queues">
              <div className="flex items-center gap-2 pb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search queues..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredQueues.map((queue) => (
                  <QueueCard key={queue.id} queue={queue} onAction={handleQueueAction} />
                ))}

                {filteredQueues.length === 0 && (
                  <div className="col-span-3 rounded-md border p-8 text-center">
                    <p className="text-muted-foreground">No queues found matching your search.</p>
                    {searchQuery && (
                      <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Other tab contents would go here */}
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
