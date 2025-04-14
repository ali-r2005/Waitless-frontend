"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { resetPasswordSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthLayout } from "@/components/sections/layouts/auth-layout"
import { resetPassword } from "@/lib/auth-service"
import type { ResetPasswordFormValues } from "@/types/auth"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTokenValid, setIsTokenValid] = useState(true)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Validate token on component mount
  useState(() => {
    const validateToken = async () => {
      try {
        const result = await fetch(`/api/auth/validate-token?token=${params.token}`)
        const data = await result.json()

        if (!data.valid) {
          setIsTokenValid(false)
          setError("This password reset link is invalid or has expired. Please request a new one.")
        }
      } catch (error) {
        console.error("Error validating token:", error)
        setIsTokenValid(false)
        setError("An error occurred while validating your reset link. Please try again.")
      }
    }

    validateToken()
  })

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!isTokenValid) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await resetPassword({
        token: params.token,
        password: data.password,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push("/auth/login?status=reset-success")
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md border-primary-teal/20 shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isTokenValid ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-primary-teal hover:bg-primary-teal/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <Button variant="outline" className="mt-2" onClick={() => router.push("/auth/forgot-password")}>
                Request New Reset Link
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary-teal hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
