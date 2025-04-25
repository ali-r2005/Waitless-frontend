"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import type { Branch } from "@/types/branch"

const branchFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  business_id: z.number().positive("Business ID is required"),
  parent_id: z.number().nullable(),
})

type BranchFormValues = z.infer<typeof branchFormSchema>

interface BranchFormProps {
  initialData?: Branch
  branches?: Branch[]
  onSubmit: (data: BranchFormValues) => Promise<void>
  isLoading?: boolean
}

export function BranchForm({
  initialData,
  branches = [],
  onSubmit,
  isLoading = false,
}: BranchFormProps) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      business_id: initialData?.business_id || 1, // You might want to make this dynamic
      parent_id: initialData?.parent_id || null,
    },
  })

  const handleSubmit = async (data: BranchFormValues) => {
    try {
      setError(null)
      await onSubmit(data)
      form.reset()
    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter branch name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter branch address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Branch</FormLabel>
              <Select
                onValueChange={(value) => {
                  const numValue = value === "null" ? null : Number(value)
                  field.onChange(numValue)
                }}
                value={field.value?.toString() || "null"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent branch (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">No Parent Branch</SelectItem>
                  {branches
                    .filter((branch) => branch.id !== initialData?.id)
                    .map((branch) => (
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

        <Button
          type="submit"
          className="w-full bg-primary-teal hover:bg-primary-teal/90"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : initialData ? "Update Branch" : "Create Branch"}
        </Button>
      </form>
    </Form>
  )
} 