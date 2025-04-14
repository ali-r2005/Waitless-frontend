"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { QueueSettingsFormValues } from "@/types/settings"

const queueSettingsSchema = z.object({
  defaultQueueCapacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }).default(50),
  defaultServiceTime: z.coerce.number().min(1, { message: "Service time must be at least 1 minute" }).default(15),
  allowCustomersToJoinOnline: z.boolean().default(true),
  allowCustomersToLeaveQueue: z.boolean().default(true),
  sendConfirmationMessages: z.boolean().default(true),
  autoStartQueues: z.boolean().default(false),
  queueDisplayMode: z.enum(["standard", "minimal", "detailed"]).default("standard"),
})

interface QueueSettingsFormProps {
  defaultValues: QueueSettingsFormValues
  onSubmit: (data: QueueSettingsFormValues) => Promise<void>
}

export function QueueSettingsForm({ defaultValues, onSubmit }: QueueSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<QueueSettingsFormValues>({
    resolver: zodResolver(queueSettingsSchema),
    defaultValues,
  })

  async function handleSubmit(data: QueueSettingsFormValues) {
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      await onSubmit(data)
      setSuccess("Queue settings updated successfully")
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {success && (
        <Alert className="mb-4 border-primary-teal bg-primary-teal/10">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="defaultQueueCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Queue Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormDescription>Maximum number of customers in a queue</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultServiceTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Service Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormDescription>Average time to serve each customer</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="queueDisplayMode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Queue Display Mode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="standard" />
                      </FormControl>
                      <FormLabel className="font-normal">Standard (Number and wait time)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="minimal" />
                      </FormControl>
                      <FormLabel className="font-normal">Minimal (Number only)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="detailed" />
                      </FormControl>
                      <FormLabel className="font-normal">Detailed (Number, wait time, and position)</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>How queue information is displayed to customers</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Options</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="allowCustomersToJoinOnline"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Online Queue Joining</FormLabel>
                      <FormDescription>Allow customers to join queues online</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowCustomersToLeaveQueue"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Self-Removal</FormLabel>
                      <FormDescription>Allow customers to remove themselves</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendConfirmationMessages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Confirmation Messages</FormLabel>
                      <FormDescription>Send confirmation messages to customers</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="autoStartQueues"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Auto-Start Queues</FormLabel>
                      <FormDescription>Automatically start queues at opening time</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary-teal hover:bg-primary-teal/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Queue Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
