"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MapPin, Building2, Loader2, Plus } from "lucide-react"
import { motion } from "framer-motion"

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
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Branch } from "@/types/branch"

const formItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    }
  })
};

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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive" className="mb-4 animate-in slide-in-from-top">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <motion.div
          custom={0}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="overflow-hidden">
                <FormLabel className="text-[#10bc69] font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Branch Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter branch name" 
                    {...field}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-12 rounded-lg focus-visible:ring-[#10bc69] focus-visible:border-[#10bc69]"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          custom={1}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="overflow-hidden">
                <FormLabel className="text-[#10bc69] font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter branch address" 
                    {...field}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-12 rounded-lg focus-visible:ring-[#10bc69] focus-visible:border-[#10bc69]"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          custom={2}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem className="overflow-hidden">
                <FormLabel className="text-[#10bc69] font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 opacity-70" />
                  Parent Branch
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    const numValue = value === "null" ? null : Number(value)
                    field.onChange(numValue)
                  }}
                  value={field.value?.toString() || "null"}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white h-12 rounded-lg focus:ring-[#10bc69]">
                      <SelectValue placeholder="Select a parent branch (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectItem value="null" className="cursor-pointer focus:bg-gray-700 focus:text-white">No Parent Branch</SelectItem>
                    {branches
                      .filter((branch) => branch.id !== initialData?.id)
                      .map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()} className="cursor-pointer focus:bg-gray-700 focus:text-white">
                          {branch.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          custom={3}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="pt-3"
        >
          <Button
            type="submit"
            className="w-full bg-[#10bc69] hover:bg-[#0ea55c] text-white flex justify-center items-center h-12 rounded-lg relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : initialData ? "Update Branch" : "Create Branch"}
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}