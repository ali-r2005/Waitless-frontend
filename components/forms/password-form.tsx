"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PasswordFormValues } from "@/types/user"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    newPassword: z.string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
      .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
      .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
    confirmPassword: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

interface PasswordFormProps {
  onSubmit: (data: PasswordFormValues) => Promise<void>
  isLoading?: boolean
}

export function PasswordForm({ onSubmit, isLoading: externalLoading }: PasswordFormProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Use external loading state if provided, otherwise use internal state
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function handleSubmit(data: PasswordFormValues) {
    if (externalLoading !== undefined) {
      // If external loading state is provided, don't manage loading state internally
      setSuccess(null)
      setError(null)
      
      try {
        await onSubmit(data)
        setSuccess("Mot de passe mis à jour avec succès")
        form.reset()
      } catch (error) {
        setError("Une erreur inattendue s'est produite. Veuillez réessayer.")
        console.error(error)
      }
    } else {
      // Otherwise manage loading state internally
      setInternalLoading(true)
      setSuccess(null)
      setError(null)

      try {
        await onSubmit(data)
        setSuccess("Mot de passe mis à jour avec succès")
        form.reset()
      } catch (error) {
        setError("Une erreur inattendue s'est produite. Veuillez réessayer.")
        console.error(error)
      } finally {
        setInternalLoading(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changer le mot de passe</CardTitle>
        <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 border-waitless-green bg-waitless-green/10">
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
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-waitless-green hover:bg-waitless-green/90 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  "Mettre à jour le mot de passe"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
