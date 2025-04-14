"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Clock, Loader2, Play } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const startQueueSchema = z.object({
  queueId: z.string({ required_error: "Please select a queue" }),
  startingNumber: z.coerce.number().min(1, { message: "Starting number must be at least 1" }).default(1),
  notifyStaff: z.boolean().default(true),
  displayOnKiosk: z.boolean().default(true),
  serviceMode: z
    .enum(["sequential", "parallel", "manual"], { required_error: "Please select a service mode" })
    .default("sequential"),
})

type StartQueueFormValues = z.infer<typeof startQueueSchema>

export default function StartQueuePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for queues
  const queues = [
    { id: "1", name: "Main Reception Queue", branch: "Downtown Branch" },
    { id: "2", name: "Consultation Queue", branch: "Main Branch" },
    { id: "3", name: "Technical Support Queue", branch: "Westside Branch" },
  ]

  const form = useForm<StartQueueFormValues>({
    resolver: zodResolver(startQueueSchema),
    defaultValues: {
      startingNumber: 1,
      notifyStaff: true,
      displayOnKiosk: true,
      serviceMode: "sequential",
    },
  })

  async function onSubmit(data: StartQueueFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would call an API to start the queue
      console.log("Starting queue:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to the queue management page
      router.push(`/queue/manage/${data.queueId}`)
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
              <h2 className="text-3xl font-bold tracking-tight">Start Queue</h2>
              <p className="text-muted-foreground">Configure and start a queue for customer service</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Queue Configuration</CardTitle>
              <CardDescription>Select a queue and configure how it will operate</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="queueId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Queue</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a queue to start" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {queues.map((queue) => (
                              <SelectItem key={queue.id} value={queue.id}>
                                {queue.name} ({queue.branch})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the queue you want to start</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Number</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormDescription>The first number to be called in the queue</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceMode"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Service Mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="sequential" />
                              </FormControl>
                              <FormLabel className="font-normal">Sequential (one customer at a time)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="parallel" />
                              </FormControl>
                              <FormLabel className="font-normal">Parallel (multiple service points)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="manual" />
                              </FormControl>
                              <FormLabel className="font-normal">Manual (staff controls next customer)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>How customers will be served from this queue</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="notifyStaff"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Staff Notifications</FormLabel>
                            <FormDescription>Notify staff when new customers join the queue</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayOnKiosk"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Display on Kiosk</FormLabel>
                            <FormDescription>Show this queue on customer-facing kiosk displays</FormDescription>
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
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Start Queue
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Queue Status Display</CardTitle>
              <CardDescription>Preview how the queue will appear to customers</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary-teal/10">
                <Clock className="h-16 w-16 text-primary-teal" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Queue Ready to Start</h3>
              <p className="text-center text-muted-foreground">
                Once you start the queue, customers will be able to join and receive service in the order configured.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
