"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Queue, CreateQueueFormValues } from "@/types/queue"
import type { Branch } from "@/types/branch"

// Define the schema for the form (used for both create and update)
const queueFormSchema = z.object({
  name: z.string().min(2, { message: "Queue name must be at least 2 characters" }),
  scheduled_date: z.string().min(1, { message: "Date is required" }),
  start_time: z.string().min(1, { message: "Start time is required" }),
  is_active: z.boolean().default(true),
  branch_id: z.string().optional(), // Optional for update, required for create if business owner
})

export type QueueFormValues = z.infer<typeof queueFormSchema>; // Export the type

export interface QueueFormProps {
  initialData?: Queue // Data for editing an existing queue
  branches: Branch[] // List of branches for the select input
  onSubmit: (values: QueueFormValues) => void // Submit handler
  isLoading: boolean // Loading state for the submit button
}

export function QueueForm({ initialData, branches, onSubmit, isLoading }: QueueFormProps) {
  // Explicitly type the useForm hook
  const form = useForm<QueueFormValues>({
    resolver: zodResolver(queueFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      scheduled_date: initialData?.scheduled_date || format(new Date(), "yyyy-MM-dd"),
      start_time: initialData?.start_time || "09:00",
      is_active: initialData?.is_active ?? true,
      branch_id: initialData?.branch_id?.toString() || "",
    },
  });

  // Reset form when initialData changes (for switching between create/edit)
  useEffect(() => {
    form.reset({
      name: initialData?.name || "",
      scheduled_date: initialData?.scheduled_date || format(new Date(), "yyyy-MM-dd"),
      start_time: initialData?.start_time || "09:00",
      is_active: initialData?.is_active ?? true,
      branch_id: initialData?.branch_id?.toString() || "",
    });
  }, [initialData, form]);

  return (
    <Form {...form}>
      {/* Explicitly type the handleSubmit callback */}
      <form onSubmit={form.handleSubmit((values: QueueFormValues) => onSubmit(values))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Queue Name</FormLabel>
              <FormControl>
                <Input placeholder="Customer Service Queue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scheduled_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input type="date" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input type="time" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {branches.length > 0 && (
          <FormField
            control={form.control}
            name="branch_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!!initialData} // Disable branch selection when editing
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Queue</FormLabel>
                <FormDescription>
                  Set the queue as active immediately after creation
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
            Reset
          </Button>
          <Button type="submit" className="bg-waitless-green hover:bg-waitless-green/90 text-white" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update Queue" : "Create Queue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
