"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Loader2, Plus } from "lucide-react"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const createQueueSchema = z.object({
  name: z.string().min(2, { message: "Queue name must be at least 2 characters" }),
  description: z.string().optional(),
  branchId: z.string({ required_error: "Please select a branch" }),
  maxCapacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }).default(50),
  estimatedServiceTime: z.coerce.number().min(1, { message: "Service time must be at least 1 minute" }).default(15),
  notifyCustomers: z.boolean().default(true),
  allowOnlineJoining: z.boolean().default(true),
})

type CreateQueueFormValues = z.infer<typeof createQueueSchema>

export default function CreateQueuePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for branches
  const branches = [
    { id: "1", name: "Main Branch" },
    { id: "2", name: "Downtown Branch" },
    { id: "3", name: "Westside Branch" },
  ]

  const form = useForm<CreateQueueFormValues>({
    resolver: zodResolver(createQueueSchema),
    defaultValues: {
      name: "",
      description: "",
      maxCapacity: 50,
      estimatedServiceTime: 15,
      notifyCustomers: true,
      allowOnlineJoining: true,
    },
  })

  async function onSubmit(data: CreateQueueFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would call an API to create the queue
      console.log("Creating queue:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to the queue management page
      router.push("/queue")
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href="/queue"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Queues
                </Link>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Create New Queue</h2>
              <p className="text-muted-foreground">Set up a new queue for your customers</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Queue Information</CardTitle>
              <CardDescription>
                Enter the details for your new queue. This information will be visible to staff and customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Queue Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Main Reception Queue" {...field} />
                          </FormControl>
                          <FormDescription>A descriptive name for your queue</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="branchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id}>
                                  {branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>The branch where this queue will be active</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a description for this queue"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Additional information about this queue</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="maxCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormDescription>Maximum number of customers allowed in this queue</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedServiceTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Service Time (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormDescription>Average time to serve each customer</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="notifyCustomers"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Customer Notifications</FormLabel>
                            <FormDescription>
                              Send notifications to customers when their turn is approaching
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowOnlineJoining"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Online Queue Joining</FormLabel>
                            <FormDescription>Allow customers to join the queue online</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => router.push("/queue")}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary-teal hover:bg-primary-teal/90" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Queue
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
