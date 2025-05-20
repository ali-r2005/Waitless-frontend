"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProfileFormValues } from "@/types/user"

const profileSchema = z.object({  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide" }),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
})

interface ProfileFormProps {
  defaultValues: ProfileFormValues
  onSubmit: (data: ProfileFormValues) => Promise<void>
  isLoading?: boolean
}

export function ProfileForm({ defaultValues, onSubmit, isLoading: externalLoading }: ProfileFormProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Use external loading state if provided, otherwise use internal state
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  })

  async function handleSubmit(data: ProfileFormValues) {
    if (externalLoading !== undefined) {
      // If external loading state is provided, don't manage loading state internally
      setSuccess(null)
      setError(null)
      
      try {
        await onSubmit(data)
        setSuccess("Profile updated successfully")
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
        console.error(error)
      }
    } else {
      // Otherwise manage loading state internally
      setInternalLoading(true)
      setSuccess(null)
      setError(null)

      try {
        await onSubmit(data)
        setSuccess("Profile updated successfully")
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
        console.error(error)
      } finally {
        setInternalLoading(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
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
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Branch Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
